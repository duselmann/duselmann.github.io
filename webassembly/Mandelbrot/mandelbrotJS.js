
function mandelbrot(a, b, max) {

  var za = a;
  var zb = b;
  
  var zat = za;
  
  var count = 0;
  
  while (count < max) {
    zaa = za*za;
    zbb = zb*zb;
    if (Math.abs(zaa+zbb) >= 4) {
      return count;
    }
    za = zaa - zbb + a;
    zb = 2*zat*zb + b;
    zat = za;
    count++;
  }
  
  return count;
}
