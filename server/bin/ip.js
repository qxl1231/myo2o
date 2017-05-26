/**
 * Created by qiangxl on 2017/5/26.
 */
var os=require('os'),
  iptable={},
  ifaces=os.networkInterfaces();
for (var dev in ifaces) {
  ifaces[dev].forEach(function(details,alias){
    if (details.family=='IPv4') {
      iptable[dev+(alias?':'+alias:'')]=details.address;
    }
  });
}
console.log(iptable);