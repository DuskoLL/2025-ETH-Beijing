// 检查MetaMask连接问题
console.log('检查MetaMask连接状态:');
console.log('window.ethereum存在:', typeof window.ethereum !== 'undefined');
if (typeof window.ethereum !== 'undefined') {
  console.log('window.ethereum对象:', window.ethereum);
  console.log('是否已解锁:', window.ethereum.isUnlocked ? '是' : '未知');
  console.log('已连接账户:', window.ethereum.selectedAddress);
  console.log('链ID:', window.ethereum.chainId);
}
