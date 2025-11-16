export default function IdolManagementIcon({ isActive }: { isActive?: boolean }) {
  return (
    <div className='pl-8 flex'>
      <svg
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'>
        <circle 
          cx={12} 
          cy={7.25} 
          r={5.73}
          fill='none'
          stroke={isActive ? '#FFF' : '#DAD6FE'}
          strokeWidth={isActive ? 1.5 : 1}
          strokeMiterlimit={10}
        />
        <path 
          d='M1.5,23.48l.37-2.05A10.3,10.3,0,0,1,12,13h0a10.3,10.3,0,0,1,10.13,8.45l.37,2.05'
          fill='none'
          stroke={isActive ? '#FFF' : '#DAD6FE'}
          strokeWidth={isActive ? 1.5 : 1}
          strokeMiterlimit={10}
        />
      </svg>
    </div>
  );
}
