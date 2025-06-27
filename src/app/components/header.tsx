'use client';

import Dock from "./header-bits";
import { VscHome, VscArchive, VscAccount, VscSettingsGear } from "react-icons/vsc";
import { useRouter } from 'next/navigation';


const Header = () => {
  const router = useRouter();

  const items = [
    { icon: <VscHome size={18} />, label: 'Home', onClick: () => router.push('/') },
    { icon: <VscArchive size={18} />, label: 'Archive', onClick: () => router.push('/archive') },
    { icon: <VscAccount size={18} />, label: 'Profile', onClick: () => router.push('/profile') },
    { icon: <VscSettingsGear size={18} />, label: 'Settings', onClick: () => router.push('/settings') },
  ];

  return (
    <Dock 
      items={items}
      panelHeight={68}
      baseItemSize={50}
      magnification={70}
      className="text-white bg-dark-navy-blue"
    />
  );
};

export default Header;