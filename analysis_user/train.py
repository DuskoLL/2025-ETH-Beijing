# -*- coding: utf-8 -*-
import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.semi_supervised import SelfTrainingClassifier
from sklearn.preprocessing import StandardScaler
from imblearn.over_sampling import SMOTE

# --------------------------
# 训练模型并保存（只需运行一次）
# --------------------------
def train_and_save_model():
    # 加载数据
    df = pd.read_csv('dataset.csv')
    
    # 处理标签：my_labels为-1表示未标记
    df['my_labels'] = df['my_labels'].replace(-1, -1)  # 明确未标记数据
    labeled_mask = df['my_labels'] != -1
    
    # 定义特征（添加缺失的balance_value字段）
    features = [
        'balance_ether', 
        'balance_value',
        'total_transactions', 
        'sent', 
        'received',
        'n_contracts_sent', 
        'n_contracts_received'
    ]
    
    # 预处理
    X = df[features].fillna(df[features].median())
    y = df['my_labels'].copy()  # 使用my_labels作为半监督标签
    
    # 标准化
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # 处理类别不平衡（仅对已标记数据）
    smote = SMOTE(random_state=42)
    X_labeled = X_scaled[labeled_mask]
    y_labeled = y[labeled_mask]
    X_resampled, y_resampled = smote.fit_resample(X_labeled, y_labeled)
    
    # 合并未标记数据
    X_combined = np.vstack([X_resampled, X_scaled[~labeled_mask]])
    y_combined = np.hstack([y_resampled, y[~labeled_mask]])
    
    # 初始化基础模型
    base_model = RandomForestClassifier(
        n_estimators=200,
        max_depth=12,
        class_weight='balanced_subsample',
        random_state=42,
        n_jobs=-1
    )
    
    # 训练基础模型
    base_model.fit(X_resampled, y_resampled)
    
    # 初始化半监督模型
    semi_supervised_model = SelfTrainingClassifier(
        base_model,
        threshold=0.8,  # 置信度阈值
        max_iter=10,
        verbose=True
    )
    
    # 训练半监督模型
    semi_supervised_model.fit(X_combined, y_combined)
    
    # 保存模型和标准化器
    joblib.dump(base_model, 'base_model.pkl')  # 单独保存基础模型
    joblib.dump(semi_supervised_model, 'semi_supervised_eth_model.pkl')
    joblib.dump(scaler, 'eth_scaler.pkl')
    print("半监督模型、基础模型和标准化器已保存")

# --------------------------
# 预测函数（实际使用部分）
# --------------------------
class ETHUserClassifier:
    def __init__(self):
        # 加载基础模型和半监督模型
        base_model = joblib.load('base_model.pkl')
        self.model = joblib.load('semi_supervised_eth_model.pkl')
        
        # 手动设置基础模型
        self.model.base_estimator = base_model
        
        # 检查基础模型是否已训练
        if not hasattr(base_model, "estimators_"):
            raise ValueError("加载的基础模型尚未训练，请检查模型保存和加载流程。")
        
        # 加载标准化器
        self.scaler = joblib.load('eth_scaler.pkl')
        
        # 定义特征
        self.features = [
            'balance_ether', 
            'balance_value',
            'total_transactions', 
            'sent', 
            'received',
            'n_contracts_sent', 
            'n_contracts_received'
        ]
        
    def predict(self, user_data):
        # 转换为DataFrame
        input_df = pd.DataFrame([user_data])
        
        # 检查特征完整性
        missing_features = set(self.features) - set(input_df.columns)
        if missing_features:
            raise ValueError(f"缺少必要特征字段：{missing_features}")
        
        # 排序特征并处理缺失值
        input_df = input_df[self.features].fillna(input_df[self.features].median())
        
        # 标准化
        scaled_data = self.scaler.transform(input_df)
        
        # 预测
        prediction = self.model.predict(scaled_data)
        probability = self.model.predict_proba(scaled_data)[:, 1]
        
        # 获取特征重要性
        feature_importance = self.model.base_estimator.feature_importances_
        
        return {
            'is_professional': bool(prediction[0]),
            'probability': round(float(probability[0]), 4),
            'feature_importance': dict(zip(self.features, feature_importance))
        }

# --------------------------
# 使用示例
# --------------------------
if __name__ == "__main__":
    # 首次运行需要训练并保存模型
    #train_and_save_model()
    
    # 初始化分类器
    classifier = ETHUserClassifier()
    
    # 模拟用户输入数据
    test_user = {
        'balance_ether': 150.2,
        'balance_value': 450,
        'total_transactions': 2380,
        'sent': 1200,
        'received': 1180,
        'n_contracts_sent': 45,
        'n_contracts_received': 32
    }
    
    # 进行预测
    try:
        result = classifier.predict(test_user)
        print("\n预测结果：")
        print(f"是否专业用户：{'是' if result['is_professional'] else '否'}")
        print(f"专业概率：{result['probability']:.2%}")
        print("\n特征重要性：")
        for feat, imp in sorted(result['feature_importance'].items(), 
                              key=lambda x: x[1], 
                              reverse=True):
            print(f"{feat:20}：{imp:.4f}")
    except Exception as e:
        print(f"预测失败：{str(e)}")