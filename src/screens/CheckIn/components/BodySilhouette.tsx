import Svg, { Circle, Rect } from 'react-native-svg';
import type { BodyRegion } from '../CheckInContext';

const ACCENT = '#1D9E75';
const BASE = '#e2e8f0';
const STROKE = '#94a3b8';

type Props = {
  view: 'front' | 'back';
  selected: BodyRegion[];
  onToggle: (r: BodyRegion) => void;
};

export function BodySilhouette({ view, selected, onToggle }: Props) {
  const isSel = (r: BodyRegion) => selected.includes(r);
  const fill = (r: BodyRegion) => (isSel(r) ? ACCENT : BASE);

  if (view === 'front') {
    return (
      <Svg viewBox="0 0 200 420" width="100%" height="100%">
        {/* Head */}
        <Circle
          cx={100}
          cy={42}
          r={30}
          fill={fill('head')}
          stroke={STROKE}
          strokeWidth={1}
          onPress={() => onToggle('head')}
        />
        {/* Chest */}
        <Rect
          x={52}
          y={82}
          width={96}
          height={72}
          rx={14}
          fill={fill('chest')}
          stroke={STROKE}
          strokeWidth={1}
          onPress={() => onToggle('chest')}
        />
        {/* Abdomen */}
        <Rect
          x={58}
          y={158}
          width={84}
          height={62}
          rx={12}
          fill={fill('abdomen')}
          stroke={STROKE}
          strokeWidth={1}
          onPress={() => onToggle('abdomen')}
        />
        {/* Right arm (viewer left) */}
        <Rect
          x={16}
          y={86}
          width={30}
          height={134}
          rx={15}
          fill={fill('right_arm')}
          stroke={STROKE}
          strokeWidth={1}
          onPress={() => onToggle('right_arm')}
        />
        {/* Left arm (viewer right) */}
        <Rect
          x={154}
          y={86}
          width={30}
          height={134}
          rx={15}
          fill={fill('left_arm')}
          stroke={STROKE}
          strokeWidth={1}
          onPress={() => onToggle('left_arm')}
        />
        {/* Right leg (viewer left) */}
        <Rect
          x={58}
          y={224}
          width={38}
          height={172}
          rx={16}
          fill={fill('right_leg')}
          stroke={STROKE}
          strokeWidth={1}
          onPress={() => onToggle('right_leg')}
        />
        {/* Left leg (viewer right) */}
        <Rect
          x={104}
          y={224}
          width={38}
          height={172}
          rx={16}
          fill={fill('left_leg')}
          stroke={STROKE}
          strokeWidth={1}
          onPress={() => onToggle('left_leg')}
        />
      </Svg>
    );
  }

  return (
    <Svg viewBox="0 0 200 420" width="100%" height="100%">
      {/* Head */}
      <Circle
        cx={100}
        cy={42}
        r={30}
        fill={fill('head')}
        stroke={STROKE}
        strokeWidth={1}
        onPress={() => onToggle('head')}
      />
      {/* Back (single region covering torso) */}
      <Rect
        x={52}
        y={82}
        width={96}
        height={138}
        rx={14}
        fill={fill('back')}
        stroke={STROKE}
        strokeWidth={1}
        onPress={() => onToggle('back')}
      />
      {/* Left arm (now on viewer's left because mirrored) */}
      <Rect
        x={16}
        y={86}
        width={30}
        height={134}
        rx={15}
        fill={fill('left_arm')}
        stroke={STROKE}
        strokeWidth={1}
        onPress={() => onToggle('left_arm')}
      />
      {/* Right arm (viewer right) */}
      <Rect
        x={154}
        y={86}
        width={30}
        height={134}
        rx={15}
        fill={fill('right_arm')}
        stroke={STROKE}
        strokeWidth={1}
        onPress={() => onToggle('right_arm')}
      />
      {/* Left leg (viewer left) */}
      <Rect
        x={58}
        y={224}
        width={38}
        height={172}
        rx={16}
        fill={fill('left_leg')}
        stroke={STROKE}
        strokeWidth={1}
        onPress={() => onToggle('left_leg')}
      />
      {/* Right leg (viewer right) */}
      <Rect
        x={104}
        y={224}
        width={38}
        height={172}
        rx={16}
        fill={fill('right_leg')}
        stroke={STROKE}
        strokeWidth={1}
        onPress={() => onToggle('right_leg')}
      />
    </Svg>
  );
}
