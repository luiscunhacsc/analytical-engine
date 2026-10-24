// Keep the engine in one namespace so it can load without ES modules or a server.
const AnalyticalEngine = (() => {
'use strict';
// A logical reconstruction: four-function mill, indexed store, and card cycles.
// Exact fractions are a modern teaching aid. Decimal mode models 40 total digits
// with a chosen fixed scale of 20 decimal places, not a historical specification.
const abs=n=>n<0n?-n:n;
const gcd=(a,b)=>{a=abs(a);b=abs(b);while(b){[a,b]=[b,a%b];}return a||1n;};
class Fraction {
  constructor(n=0n,d=1n){n=BigInt(n);d=BigInt(d);if(!d)throw Error('Division by zero. The engine has stopped.');if(d<0n){n=-n;d=-d;}const g=gcd(n,d);this.n=n/g;this.d=d/g;}
  static from(v){if(v instanceof Fraction)return v;const s=String(v).trim();if(!/^[+-]?\d+(?:\/\d+|\.\d+)?$/.test(s))throw Error('Enter an integer, decimal, or fraction such as 1/6.');if(s.length>120)throw Error('Number is too long.');if(s.includes('/')){const [a,b]=s.split('/');return new Fraction(a,b);}if(s.includes('.')){const [a,b]=s.split('.');return new Fraction(BigInt(a+b),10n**BigInt(b.length));}return new Fraction(s);}
  add(b){b=Fraction.from(b);return new Fraction(this.n*b.d+b.n*this.d,this.d*b.d);}
  sub(b){b=Fraction.from(b);return new Fraction(this.n*b.d-b.n*this.d,this.d*b.d);}
  mul(b){b=Fraction.from(b);return new Fraction(this.n*b.n,this.d*b.d);}
  div(b){b=Fraction.from(b);return new Fraction(this.n*b.d,this.d*b.n);}
  toString(){return this.d===1n?String(this.n):`${this.n}/${this.d}`;}
  decimal(digits=12){const negative=this.n<0n;const a=abs(this.n);let rem=a%this.d;let out=String(a/this.d);if(rem){out+='.';for(let i=0;i<digits&&rem;i++){rem*=10n;out+=String(rem/this.d);rem%=this.d;}if(rem)out+='…';}return (negative?'-':'')+out;}
}
const symbols={add:'+',sub:'−',mul:'×',div:'÷'};
const register=i=>`V${String(i).padStart(2,'0')}`;
const F=v=>Fraction.from(v);
const card=(op,a,b,to,note,extra={})=>({op,a,b,to:Array.isArray(to)?to:[to],note,...extra});
const known=['1/6','-1/30','1/42','-1/30','5/66','-691/2730'];
function bernoulli(n=4){
  if(!Number.isInteger(n)||n<1||n>6)throw Error('Choose n from 1 to 6.');
  const initial={1:'1',2:'2',3:String(n)};for(let k=1;k<n;k++)initial[20+k]=known[k-1];
  const cards=[
    card('mul',2,3,[4,5,6],'Form 2n and copy it to three working columns.'),
    card('sub',4,1,4,'Form the numerator 2n − 1.'),
    card('add',5,1,5,'Form the denominator 2n + 1.'),
    card('div',4,5,11,'Divide (2n − 1) by (2n + 1). The printed diagram reverses these operands.'),
    card('div',11,2,11,'Halve the quotient to obtain the initial coefficient.'),
    card('sub',13,11,13,'Start the accumulator with the negative initial coefficient.'),
    card('sub',3,1,10,'Set the number of earlier Bernoulli terms to use.',{branch:'first'}),
    card('add',2,7,7,'Set the coefficient denominator to 2.'),
    card('div',6,7,11,'Form the first coefficient: 2n ÷ 2 = n.'),
    card('mul',21,11,12,'Multiply the first Bernoulli number by its coefficient.'),
    card('add',12,13,13,'Add the first contribution to the accumulator.'),
    card('sub',10,1,10,'Count one earlier Bernoulli term as used.',{branch:'first'}),
    card('sub',6,1,6,'Decrease the coefficient numerator.'),
    card('add',1,7,7,'Increase the coefficient denominator.'),
    card('div',6,7,8,'Form the next ratio in the coefficient.'),
    card('mul',8,11,11,'Multiply the running coefficient by this ratio.'),
    card('sub',6,1,6,'Decrease the numerator once more.'),
    card('add',1,7,7,'Increase the denominator once more.'),
    card('div',6,7,9,'Form the second ratio in this cycle.'),
    card('mul',9,11,11,'Complete the coefficient for the next Bernoulli number.'),
    card('mul','prior',11,12,'Multiply the next stored Bernoulli number by its coefficient.'),
    card('add',12,13,13,'Accumulate this contribution.'),
    card('sub',10,1,10,'Count the term; repeat cards 13–23 if more terms remain.',{branch:'cycle'}),
    card('sub',0,13,20+n,'Negate the accumulated sum to obtain the new Bernoulli number. The final sign is made explicit.'),
    card('add',3,1,3,'Advance n for the next calculation. This single-number demonstration now stops.')
  ];
  return {id:'bernoulli',title:'Ada’s Bernoulli numbers',short:'Bernoulli numbers',kicker:'ADA LOVELACE · NOTE G · 1843',description:'Follow the celebrated table from Note G. Repeated cycles combine earlier Bernoulli numbers to calculate the next.',initial,cards,output:20+n,outputLabel:`B${2*n-1} = B${2*n} (modern)`,expected:known[n-1],params:{n},rows:Array.from({length:Math.max(25,21+n)},(_,i)=>i),source:'https://www.fourmilab.ch/babbage/sketch.html#NoteG',sourceName:'Read Note G',provenance:'Executable reconstruction of Note G’s 25-row table. Row 4 uses the corrected division; row 24 makes the final negation explicit. The repeated cycle is executed, not precomputed. Earlier Bernoulli numbers are supplied as in Ada’s example. Working columns are retained at the end for inspection.'};
}
function power(a='5',x='98',n=7){
  if(!Number.isInteger(n)||n<1||n>12)throw Error('Choose an exponent from 1 to 12.');
  F(a);F(x);
  const cards=n===1?[card('mul',1,3,4,'Multiply a by x to complete a × x.')]:[card('mul',3,3,4,'Square x to begin forming its power.'),...(n>2?[card('mul',4,3,4,'Multiply by x again until xⁿ has been formed.',{branch:'power'})]:[]),card('mul',1,4,4,'Multiply the completed power by the coefficient a.')];
  return {id:'power',title:'A cycle of multiplication',short:'A cycle of multiplication',kicker:'ADA LOVELACE · NOTE B · 1843',description:'Begin with Ada’s example, 5 × 98⁷. One repeated operation shows how a short set of cards can describe a long calculation.',initial:{1:a,2:String(n),3:x},cards,params:{a,x,n},output:4,outputLabel:`${a} × ${x}^${n}`,expected:F(a).mul(new Fraction(F(x).n**BigInt(n),F(x).d**BigInt(n))).toString(),rows:[1,2,3,4],source:'https://www.fourmilab.ch/babbage/sketch.html#NoteB',sourceName:'Read Note B',provenance:'A teaching card arrangement of the repeated multiplication described in Note B, using Ada’s values a = 5, x = 98, n = 7. Six multiplications form x⁷; a seventh multiplies by a. Her prose specifies this order; this register allocation is modern.'};
}
function equations(a='2',b='1',c='5',d='1',e='-1',f='1'){
  [a,b,c,d,e,f].forEach(F);
  const cards=[card('mul',1,5,7,'Multiply a by e.'),card('mul',2,4,8,'Multiply b by d.'),card('sub',7,8,9,'Find the determinant ae − bd.'),card('mul',3,5,10,'Multiply c by e.'),card('mul',2,6,11,'Multiply b by f.'),card('sub',10,11,12,'Form the numerator ce − bf.'),card('div',12,9,13,'Divide by the determinant to find x.'),card('mul',1,6,14,'Multiply a by f.'),card('mul',3,4,15,'Multiply c by d.'),card('sub',14,15,16,'Form the numerator af − cd.'),card('div',16,9,17,'Divide by the determinant to find y.')];
  return {id:'equations',title:'Two equations, two unknowns',short:'Simultaneous equations',kicker:'MENABREA · TRANSLATED BY LOVELACE · 1843',description:'Solve ax + by = c and dx + ey = f with the mill’s four operations. An introductory example inspired by Menabrea’s account.',initial:{1:a,2:b,3:c,4:d,5:e,6:f},cards,params:{a,b,c,d,e,f},output:13,outputs:[13,17],outputLabel:'x, y',rows:Array.from({length:17},(_,i)=>i+1),source:'https://psychclassics.yorku.ca/Lovelace/menabrea.htm',sourceName:'Read Menabrea’s account',provenance:'Modern card arrangement of elimination for two linear equations, a problem treated in Menabrea’s account translated by Lovelace. These coefficients and this two-result deck are teaching examples, not a transcription of his table and not an Ada-authored program.'};
}
class Engine {
  constructor(program=bernoulli(),mode='exact'){this.program=program;this.mode=mode;this.reset();}
  normalize(v){v=F(v);if(this.mode==='decimal'){const scale=10n**20n;const scaled=v.n*scale/v.d;if(abs(scaled)>=10n**40n)throw Error('40-digit store overflow. Try smaller inputs or exact fractions.');return new Fraction(scaled,scale);}if(String(abs(v.n)).length>250||String(v.d).length>250)throw Error('Teaching-model limit exceeded (250 digits).');return v;}
  reset(){this.store=new Map();Object.entries(this.program.initial).forEach(([i,v])=>this.store.set(Number(i),this.normalize(v)));this.pc=0;this.steps=0;this.prior=22;this.iteration=0;this.history=[];this.trace=[];this.done=false;this.error=null;this.last=null;}
  read(i){return this.store.get(i)||new Fraction();}
  current(){if(this.done)return null;const c=this.program.cards[this.pc];return {...c,a:c.a==='prior'?this.prior:c.a,number:this.pc+1};}
  step(){
    if(this.done||this.error)return null;
    const before={store:new Map(this.store),pc:this.pc,steps:this.steps,prior:this.prior,iteration:this.iteration,last:this.last,done:this.done};
    try {
      const c=this.current();const left=this.read(c.a),right=this.read(c.b);const result=this.normalize(left[c.op](right));
      this.history.push(before);c.to.forEach(i=>this.store.set(i,result));this.steps++;this.pc++;this.iteration++;
      let repeated=false;
      if(c.branch==='first'&&this.read(10).n===0n)this.pc=23;
      if(c.branch==='cycle'&&this.read(10).n>0n){this.pc=12;this.prior++;repeated=true;}
      if(c.branch==='power'&&this.iteration<this.program.params.n-1){this.pc=1;repeated=true;}
      this.done=this.pc>=this.program.cards.length;
      this.last={...c,left:left.toString(),right:right.toString(),result:result.toString(),step:this.steps,repeated};this.trace.push(this.last);return this.last;
    } catch(e){this.error=e.message;return null;}
  }
  back(){if(this.error){this.error=null;return;}const s=this.history.pop();if(s){Object.assign(this,s);this.trace.pop();}}
  run(){let limit=10000;while(!this.done&&!this.error&&limit--)this.step();if(limit<=0)throw Error('Operation limit exceeded.');return this.read(this.program.output).toString();}
}
return {Engine,Fraction,bernoulli,power,equations,symbols,register};
})();
