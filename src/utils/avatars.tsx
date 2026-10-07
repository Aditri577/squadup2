import React from 'react';

export interface AvatarItem {
  id: string;
  name: string;
  render: (className?: string) => React.ReactNode;
}

export const CUTE_AVATARS: AvatarItem[] = [
  {
    id: 'duo-owl',
    name: 'Duo Owl',
    render: (className = 'w-full h-full') => (
      <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Body */}
        <rect x="20" y="25" width="60" height="60" rx="30" fill="#78C800" />
        <path d="M20 55C20 71.5685 33.4315 85 50 85C66.5685 85 80 71.5685 80 55" fill="#58A700" />
        {/* Belly */}
        <ellipse cx="50" cy="65" rx="20" ry="15" fill="#FFFFFF" />
        <path d="M42 62L46 66L50 62L54 66L58 62" stroke="#58A700" strokeWidth="2.5" strokeLinecap="round" />
        {/* Eyes Background */}
        <circle cx="36" cy="42" r="14" fill="#FFFFFF" />
        <circle cx="64" cy="42" r="14" fill="#FFFFFF" />
        {/* Eye Rings */}
        <circle cx="36" cy="42" r="14" stroke="#8EE000" strokeWidth="3" />
        <circle cx="64" cy="42" r="14" stroke="#8EE000" strokeWidth="3" />
        {/* Pupils */}
        <circle cx="38" cy="42" r="6" fill="#1B1B1B" />
        <circle cx="62" cy="42" r="6" fill="#1B1B1B" />
        <circle cx="36" cy="40" r="2.5" fill="#FFFFFF" />
        <circle cx="60" cy="40" r="2.5" fill="#FFFFFF" />
        {/* Beak */}
        <polygon points="50,44 44,54 56,54" fill="#FF9600" />
        <polygon points="50,46 46,53 54,53" fill="#FF7800" />
        {/* Ears/Feathers */}
        <path d="M25 28L15 18L28 22" fill="#58A700" stroke="#58A700" strokeWidth="2" strokeLinejoin="round" />
        <path d="M75 28L85 18L72 22" fill="#58A700" stroke="#58A700" strokeWidth="2" strokeLinejoin="round" />
        {/* Feet */}
        <circle cx="40" cy="85" r="5" fill="#FF9600" />
        <circle cx="60" cy="85" r="5" fill="#FF9600" />
      </svg>
    )
  },
  {
    id: 'happy-monster',
    name: 'Happy Monster',
    render: (className = 'w-full h-full') => (
      <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Body */}
        <path d="M15 50C15 28 30 20 50 20C70 20 85 28 85 50C85 72 72 85 50 85C28 85 15 72 15 50Z" fill="#C084FC" />
        <path d="M15 55C15 72 28 85 50 85C72 85 85 72 85 55" fill="#A855F7" />
        {/* Horns */}
        <path d="M25 24L15 12L30 18" fill="#F472B6" stroke="#E879F9" strokeWidth="3" strokeLinejoin="round" />
        <path d="M75 24L85 12L70 18" fill="#F472B6" stroke="#E879F9" strokeWidth="3" strokeLinejoin="round" />
        {/* Single Big Eye */}
        <circle cx="50" cy="45" r="16" fill="#FFFFFF" stroke="#F472B6" strokeWidth="3" />
        <circle cx="50" cy="45" r="8" fill="#1E1B4B" />
        <circle cx="47" cy="42" r="3" fill="#FFFFFF" />
        {/* Cute Cheeks */}
        <circle cx="28" cy="58" r="4" fill="#F472B6" opacity="0.6" />
        <circle cx="72" cy="58" r="4" fill="#F472B6" opacity="0.6" />
        {/* Mouth and Teeth */}
        <path d="M40 60C40 68 60 68 60 60" stroke="#1E1B4B" strokeWidth="3" strokeLinecap="round" />
        <polygon points="46,60 48,64 50,60" fill="#FFFFFF" />
        <polygon points="50,60 52,64 54,60" fill="#FFFFFF" />
      </svg>
    )
  },
  {
    id: 'pixel-robot',
    name: 'Pixel Robot',
    render: (className = 'w-full h-full') => (
      <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Head */}
        <rect x="22" y="25" width="56" height="46" rx="8" fill="#06B6D4" stroke="#0891B2" strokeWidth="3" />
        <rect x="26" y="29" width="48" height="38" rx="5" fill="#22D3EE" />
        {/* Antenna */}
        <rect x="47" y="14" width="6" height="11" fill="#0891B2" />
        <circle cx="50" cy="12" r="5" fill="#FF007A" />
        {/* Eyes (Glowing LEDs) */}
        <rect x="34" y="38" width="10" height="10" rx="2" fill="#0E172C" />
        <rect x="56" y="38" width="10" height="10" rx="2" fill="#0E172C" />
        <circle cx="39" cy="43" r="3" fill="#38BDF8" />
        <circle cx="61" cy="43" r="3" fill="#38BDF8" />
        {/* Mouth (Soundwave) */}
        <rect x="38" y="55" width="24" height="4" rx="2" fill="#0E172C" />
        <line x1="44" y1="55" x2="44" y2="59" stroke="#38BDF8" strokeWidth="1.5" />
        <line x1="50" y1="54" x2="50" y2="60" stroke="#38BDF8" strokeWidth="1.5" />
        <line x1="56" y1="55" x2="56" y2="59" stroke="#38BDF8" strokeWidth="1.5" />
        {/* Neck */}
        <rect x="42" y="71" width="16" height="8" fill="#0891B2" />
        {/* Shoulders */}
        <path d="M20 79H80V85H20V79Z" fill="#0891B2" />
        {/* Ears (Bolts) */}
        <rect x="16" y="42" width="6" height="12" rx="2" fill="#64748B" />
        <rect x="78" y="42" width="6" height="12" rx="2" fill="#64748B" />
      </svg>
    )
  },
  {
    id: 'cute-panda',
    name: 'Cute Panda',
    render: (className = 'w-full h-full') => (
      <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Ears */}
        <circle cx="28" cy="24" r="12" fill="#1F2937" />
        <circle cx="72" cy="24" r="12" fill="#1F2937" />
        <circle cx="28" cy="24" r="6" fill="#111827" />
        <circle cx="72" cy="24" r="6" fill="#111827" />
        {/* Head */}
        <circle cx="50" cy="52" r="34" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="2" />
        <path d="M16 52C16 70.7777 31.2223 86 50 86C68.7777 86 84 70.7777 84 52" fill="#F9FAFB" />
        {/* Eye Patches */}
        <ellipse cx="36" cy="48" rx="10" ry="13" transform="rotate(-15 36 48)" fill="#1F2937" />
        <ellipse cx="64" cy="48" rx="10" ry="13" transform="rotate(15 64 48)" fill="#1F2937" />
        {/* Eyes */}
        <circle cx="37" cy="46" r="4.5" fill="#FFFFFF" />
        <circle cx="63" cy="46" r="4.5" fill="#FFFFFF" />
        <circle cx="38" cy="45" r="1.5" fill="#1F2937" />
        <circle cx="62" cy="45" r="1.5" fill="#1F2937" />
        {/* Nose & Mouth */}
        <ellipse cx="50" cy="58" rx="4.5" ry="3" fill="#111827" />
        <path d="M46 64C48 66 50 66 50 64C50 66 52 66 54 64" stroke="#111827" strokeWidth="2" strokeLinecap="round" />
        {/* Rosy Cheeks */}
        <circle cx="23" cy="58" r="4" fill="#FCA5A5" opacity="0.6" />
        <circle cx="77" cy="58" r="4" fill="#FCA5A5" opacity="0.6" />
      </svg>
    )
  },
  {
    id: 'cool-cat',
    name: 'Cool Cat',
    render: (className = 'w-full h-full') => (
      <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Head */}
        <circle cx="50" cy="54" r="32" fill="#FB923C" />
        <path d="M18 54C18 71.6731 32.3269 86 50 86C67.6731 86 82 71.6731 82 54" fill="#EA580C" />
        {/* Ears */}
        <polygon points="22,34 12,12 36,24" fill="#EA580C" stroke="#FB923C" strokeWidth="2" />
        <polygon points="26,31 18,17 34,24" fill="#FECDD3" />
        <polygon points="78,34 88,12 64,24" fill="#EA580C" stroke="#FB923C" strokeWidth="2" />
        <polygon points="74,31 82,17 66,24" fill="#FECDD3" />
        {/* Cool Sunglasses */}
        <path d="M22 42H78V52C78 52 74 60 64 60C54 60 50 54 50 54C50 54 46 60 36 60C26 60 22 52 22 52V42Z" fill="#1E293B" />
        <path d="M26 44H46V48C46 51 43 54 36 54C29 54 26 51 26 48V44Z" fill="#0F172A" />
        <path d="M54 44H74V48C74 51 71 54 64 54C57 54 54 51 54 48V44Z" fill="#0F172A" />
        <path d="M28 46L36 49" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        <path d="M56 46L64 49" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        {/* Nose & Whiskers */}
        <polygon points="50,62 47,60 53,60" fill="#1E293B" />
        <path d="M42 66H26" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
        <path d="M42 70H28" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
        <path d="M58 66H74" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
        <path d="M58 70H72" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
        <path d="M46 67C48 69 50 69 50 67C50 69 52 69 54 67" stroke="#1E293B" strokeWidth="2" />
      </svg>
    )
  },
  {
    id: 'space-astronaut',
    name: 'Space Explorer',
    render: (className = 'w-full h-full') => (
      <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Helmet Outer */}
        <circle cx="50" cy="50" r="36" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="3" />
        <circle cx="50" cy="54" r="32" fill="#E2E8F0" />
        {/* Visor */}
        <path d="M24 46C24 32 32 26 50 26C68 26 76 32 76 46C76 60 68 64 50 64C32 64 24 60 24 46Z" fill="#1E1B4B" stroke="#475569" strokeWidth="2" />
        {/* Visor reflection */}
        <path d="M30 42C30 34 38 30 50 30" stroke="#38BDF8" strokeWidth="3.5" strokeLinecap="round" opacity="0.8" />
        <circle cx="68" cy="38" r="2.5" fill="#FFFFFF" />
        {/* Cheeks inside helmet */}
        <circle cx="34" cy="52" r="3" fill="#EC4899" opacity="0.5" />
        <circle cx="66" cy="52" r="3" fill="#EC4899" opacity="0.5" />
        {/* Small face expression */}
        <circle cx="42" cy="46" r="2.5" fill="#38BDF8" />
        <circle cx="58" cy="46" r="2.5" fill="#38BDF8" />
        <path d="M47 50C48 51.5 52 51.5 53 50" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
        {/* Badge on helmet */}
        <circle cx="50" cy="74" r="5" fill="#6366F1" />
        <polygon points="50,71 52,75 48,75" fill="#FFFFFF" />
      </svg>
    )
  }
];

export const getAvatarById = (id: string): AvatarItem | undefined => {
  return CUTE_AVATARS.find(av => av.id === id);
};

export const renderAvatar = (avatarUrlOrId: string, className = 'w-full h-full') => {
  const found = getAvatarById(avatarUrlOrId);
  if (found) {
    return found.render(className);
  }
  // Fallback to image tag
  return <img src={avatarUrlOrId} alt="User Avatar" className={`${className} object-cover`} />;
};
