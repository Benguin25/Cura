// ─── Original image dimensions (px) ────────────────────────────────────────
export const IMG_W = 720;
export const IMG_H = 789;

// ─── Body part definitions ──────────────────────────────────────────────────
export interface BodyPart {
  key: string;
  label: string;
  coords: number[]; // flat [x0,y0, x1,y1, ...]
}

export const BODY_PARTS: BodyPart[] = [
  // ── FRONT ──────────────────────────────────────────────────────────────
  { key: '2',  label: 'Head',                 coords: [198,23,175,31,165,78,188,112,212,113,234,72,224,28] },
  { key: '1',  label: 'Maxillofacial',         coords: [220,58,180,58,182,84,199,107,218,82] },
  { key: '3',  label: 'Neck',                  coords: [219,105,225,125,245,135,153,137,175,124,179,103,189,112,206,115] },
  { key: '20', label: 'Right Shoulder',        coords: [153,136,122,145,121,174,146,184] },
  { key: '26', label: 'Left Shoulder',         coords: [246,134,273,144,279,173,253,182] },
  { key: '4',  label: 'Chest',                 coords: [154,138,244,135,253,184,249,267,199,226,152,264,147,182] },
  { key: '10', label: 'Abdominal',             coords: [250,268,254,292,199,312,145,290,149,268,199,230] },
  { key: '9',  label: 'Pelvis',                coords: [254,293,256,313,201,367,140,315,145,291,199,311] },
  { key: '14', label: 'Left Hip',              coords: [258,313,260,344,204,368,215,353] },
  { key: '15', label: 'Right Hip',             coords: [141,316,139,349,196,370,185,354] },
  { key: '27', label: 'Left Femur/Thigh',      coords: [202,369,260,345,259,443,215,457] },
  { key: '21', label: 'Right Femur/Thigh',     coords: [197,371,183,453,140,441,136,348] },
  { key: '39', label: 'Left Knee',             coords: [213,457,225,507,263,498,258,444] },
  { key: '33', label: 'Right Knee',            coords: [187,455,142,442,136,496,174,505] },
  { key: '34', label: 'Right Tib/Fib',         coords: [174,505,137,497,128,533,144,604,161,605,172,548] },
  { key: '38', label: 'Left Tib/Fib',          coords: [226,506,226,544,237,597,257,598,268,544,265,498,244,504] },
  { key: '42', label: 'Left Ankle',            coords: [238,598,255,598,256,631,231,633] },
  { key: '35', label: 'Right Ankle',           coords: [163,604,145,605,143,634,167,634] },
  { key: '36', label: 'Right Foot',            coords: [143,633,136,680,156,697,173,692,168,636] },
  { key: '37', label: 'Left Foot',             coords: [230,633,225,692,246,698,261,680,257,631] },
  { key: '32', label: 'Right Humerus',         coords: [146,185,148,222,142,250,115,240,123,196,120,175] },
  { key: '22', label: 'Right Elbow',           coords: [117,240,142,250,140,275,110,263] },
  { key: '23', label: 'Right Forearm',         coords: [140,276,123,317,103,308,106,292,109,264] },
  { key: '24', label: 'Right Wrist',           coords: [124,319,117,337,95,323,103,309] },
  { key: '25', label: 'Right Hand',            coords: [117,337,107,378,89,388,75,377,85,343,71,346,80,330,94,323] },
  { key: '40', label: 'Left Humerus',          coords: [278,174,279,194,283,237,256,249,253,218,254,180] },
  { key: '29', label: 'Left Elbow',            coords: [290,261,281,240,256,249,258,274] },
  { key: '28', label: 'Left Forearm',          coords: [261,274,290,261,297,308,276,320] },
  { key: '31', label: 'Left Wrist',            coords: [284,340,279,319,296,309,305,321] },
  { key: '30', label: 'Left Hand',             coords: [285,341,304,322,317,327,333,351,317,342,324,379,309,389,291,377] },
  // ── BACK ───────────────────────────────────────────────────────────────
  { key: '19', label: 'Skull/Brain',           coords: [462,29,454,73,469,93,515,92,527,74,515,29,491,13] },
  { key: '41', label: 'Spine',                 coords: [480,101,481,313,498,312,499,100] },
  { key: '17', label: 'Right Shoulder (Back)', coords: [566,141,541,195,498,196,500,106] },
  { key: '18', label: 'Left Shoulder (Back)',  coords: [480,109,415,140,438,197,480,196] },
  { key: '5',  label: 'Back',                  coords: [542,196,539,244,549,312,432,311,439,249,438,197] },
  { key: '16', label: 'Buttocks',              coords: [548,312,430,313,426,366,554,366] },
  { key: '11', label: 'Right Arm (Back)',      coords: [566,143,545,189,543,207,550,269,574,329,584,372,607,385,615,374,622,338,597,315,585,288,576,238,569,190] },
  { key: '8',  label: 'Left Arm (Back)',       coords: [398,373,377,383,368,376,360,343,371,324,392,311,397,269,405,238,410,193,408,160,416,141,437,197,430,240,429,263,408,320,399,352] },
  { key: '7',  label: 'Right Leg (Back)',      coords: [494,366,494,387,506,428,505,464,517,500,517,536,528,590,518,665,524,695,553,682,546,607,562,529,552,475,550,435,555,365] },
  { key: '12', label: 'Left Leg (Back)',       coords: [486,367,426,367,427,442,428,475,417,527,433,602,432,634,425,675,446,695,464,684,459,629,450,596,464,539,463,497,474,472,478,423] },
];

// Convert flat coord array → SVG points string, scaled to display size
export function toPoints(coords: number[], scale: number): string {
  const pairs: string[] = [];
  for (let i = 0; i < coords.length; i += 2) {
    pairs.push(`${coords[i] * scale},${coords[i + 1] * scale}`);
  }
  return pairs.join(' ');
}
