import * as cg from "../render/core/cg.js";

export function solveBallisticArc(proj_pos, proj_speed, target, gravity) {

  console.assert(proj_pos !== target, "Target and projectile positions are the same");
  console.assert(proj_speed >= 0, "Projectile speed must be non-negative");
  console.assert(gravity >= 0, "Gravity must be non-negative");

  // Derivation
  //   (1) x = v*t*cos O
  //   (2) y = v*t*sin O - .5*g*t^2
  // 
  //   (3) t = x/(cos O*v)                                        [solve t from (1)]
  //   (4) y = v*x*sin O/(cos O * v) - .5*g*x^2/(cos^2 O*v^2)     [plug t into y=...]
  //   (5) y = x*tan O - g*x^2/(2*v^2*cos^2 O)                    [reduce; cos/sin = tan]
  //   (6) y = x*tan O - (g*x^2/(2*v^2))*(1+tan^2 O)              [reduce; 1+tan O = 1/cos^2 O]
  //   (7) 0 = ((-g*x^2)/(2*v^2))*tan^2 O + x*tan O - (g*x^2)/(2*v^2) - y    [re-arrange]
  //   Quadratic! a*p^2 + b*p + c where p = tan O
  //
  //   (8) let gxv = -g*x*x/(2*v*v)
  //   (9) p = (-x +- sqrt(x*x - 4gxv*(gxv - y)))/2*gxv           [quadratic formula]
  //   (10) p = (v^2 +- sqrt(v^4 - g(g*x^2 + 2*y*v^2)))/gx        [multiply top/bottom by -2*v*v/x; move 4*v^4/x^2 into root]
  //   (11) O = atan(p)

  const diff = cg.vsub(target, proj_pos);
  const diffXZ = [diff[0], 0, diff[2]];
  const groundDist = cg.magnitude(diffXZ);

  const speed2 = proj_speed*proj_speed;
  const speed4 = proj_speed*proj_speed*proj_speed*proj_speed;
  const y = diff[2];
  const x = groundDist;
  const gx = gravity*x;

  let root = speed4 - gravity*(gravity*x*x + 2*y*speed2);

  // No solution
  if (root < 0)
      return [];

  root = Math.sqrt(root);

  const lowAng = Math.atan2(speed2 - root, gx);
  const highAng = Math.atan2(speed2 + root, gx);
  const numSolutions = lowAng != highAng ? 2 : 1;


  const solutions = [];
  const groundDir = cg.normalize(diffXZ); // 3d vector
  const s0_p1 = cg.scale(groundDir, Math.cos(lowAng)*proj_speed);
  const s0_p2 = cg.scale([0,1,0], Math.sin(lowAng)*proj_speed);
  const s0 = cg.vadd(s0_p1, s0_p2);
  solutions.push(s0);
  if (numSolutions > 0) {
    const s1_p1 = cg.scale(groundDir, Math.cos(highAng)*proj_speed);
    const s1_p2 = cg.scale([0,1,0], Math.sin(highAng)*proj_speed);
    const s1 = cg.vadd(s1_p1, s1_p2);
    solutions.push(s1);
  }

  return solutions;
}