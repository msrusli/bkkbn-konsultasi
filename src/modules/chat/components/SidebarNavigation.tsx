"use client";
import NextImage from "next/image";
import React from "react";
import {
  Image,
  Home,
  MessageSquare,
  BookOpen,
  Mic,
  Calendar,
  Newspaper,
  Settings,
  Users,
} from "lucide-react";
import Link from "next/link";

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  active?: boolean;
}

const menuItems: SidebarItem[] = [
  {
    name: "Beranda",
    href: "https://underdev-superapps.framer.website/dashboard-beranda",
    icon: (
      <NextImage src="/beranda.png" alt="Beranda icon" width={24} height={24} />
    ),
  },
  {
    name: "Konsultasi",
    href: "#",
    icon: (
      <NextImage
        src="/konsultasi.png"
        alt="Beranda icon"
        width={24}
        height={24}
      />
    ),
    active: true,
  },
  {
    name: "Metaverse",
    href: "#",
    icon: (
      <NextImage
        src="/metaverse.png"
        alt="Beranda icon"
        width={24}
        height={24}
      />
    ),
  },
  {
    name: "E-Course",
    href: "https://underdev-superapps.framer.website/dashboard-ecourse-siap-manten",
    icon: (
      <NextImage src="/ecourse.png" alt="Beranda icon" width={24} height={24} />
    ),
  },
  {
    name: "Bisik Forum",
    href: "https://underdev-superapps.framer.website/dashboard-bisik",
    icon: (
      <NextImage
        src="/bisikforum.png"
        alt="Beranda icon"
        width={24}
        height={24}
      />
    ),
  },
  {
    name: "Podcast",
    href: "https://underdev-superapps.framer.website/dashboard-bisik",
    icon: (
      <NextImage src="/podcast.png" alt="Beranda icon" width={24} height={24} />
    ),
  },
  {
    name: "Event",
    href: "https://underdev-superapps.framer.website/dashboard-event-tersedia",
    icon: (
      <NextImage src="/event.png" alt="Beranda icon" width={24} height={24} />
    ),
  },
  {
    name: "Berita Terkini",
    href: "https://underdev-superapps.framer.website/dashboard-news",
    icon: (
      <NextImage
        src="/beritaterkini.png"
        alt="Beranda icon"
        width={24}
        height={24}
      />
    ),
  },
  {
    name: "Artikel Interaktif",
    href: "https://underdev-superapps.framer.website/dashboard-news",
    icon: (
      <NextImage src="/artikel.png" alt="Beranda icon" width={24} height={24} />
    ),
  },
  {
    name: "Pengaturan",
    href: "https://underdev-superapps.framer.website/dashboard-setting-detail",
    icon: <Settings className="w-6 h-6" />,
  },
];

export default function SidebarNavigation() {
  return (
    <aside
      className="w-80 text-white shadow-lg p-6 flex flex-col justify-between"
      style={{ backgroundColor: "rgb(59, 147, 193)", opacity: 1 }}
    >
      <div>
        {/* Logo */}
        <div className="flex items-center gap-3 mb-6 mt-1">
          <img src="./bkkbn.png" alt="Logo" />
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                item.active
                  ? "bg-yellow-500 text-black"
                  : "hover:bg-yellow-500 hover:text-black"
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* User Info */}
      <div className="mt-6">
        <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            F
          </div>
          <div className="text-sm">
            <div className="font-medium">Fitri Ariani</div>
            <div className="text-xs opacity-90">fitriariani@gmail.com</div>
          </div>
        </div>
        <p className="text-xs mt-4 opacity-80 text-center">
          Copyright © 2025 All rights reserved.
        </p>
      </div>
    </aside>
  );
}

// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import {
//   Grid,
//   Headset,
//   Presentation,
//   MessageSquare,
//   Mic,
//   Calendar,
//   Newspaper,
//   FileText,
//   Settings,
//   LogOut,
// } from "lucide-react";
// import { usePathname } from "next/navigation";

// type NavItemProps = {
//   href: string;
//   label: string;
//   icon: React.ReactNode;
//   active?: boolean;
// };

// const NavItem = ({ href, label, icon, active }: NavItemProps) => {
//   const pathname = usePathname();
//   const isActive = active || pathname === href;

//   return (
//     <Link
//       href={href}
//       className={`flex items-center gap-4 py-3 px-4 rounded-xl text-base font-medium transition-colors ${
//         isActive
//           ? "bg-sidebar-active text-sidebar-foreground"
//           : "text-sidebar-foreground hover:bg-sidebar-hover"
//       }`}
//     >
//       <div className="w-6 h-6 flex items-center justify-center">{icon}</div>
//       <span>{label}</span>
//     </Link>
//   );
// };

// const SidebarNavigation = () => {
//   const navItems = [
//     {
//       href: "/dashboard-beranda",
//       label: "Beranda",
//       icon: (
//         <Image src="/beranda.png" alt="Beranda icon" width={24} height={24} />
//       ),
//       active: true, // As per instruction
//     },
//     {
//       href: "https://bkkbn-konsultasi.vercel.app/chatbot",
//       label: "Konsultasi",
//       icon: (
//         <Image
//           src="/beranda.png"
//           alt="Konsultasi icon"
//           width={24}
//           height={24}
//         />
//       ),
//     },
//     {
//       href: "/onboarding-metaverse",
//       label: "Metaverse",
//       icon: (
//         <Image src="/beranda.png" alt="Metaverse icon" width={24} height={24} />
//       ),
//     },
//     {
//       href: "/dashboard-ecourse-siap-manten",
//       label: "E-Course",
//       icon: (
//         <Image src="/beranda.png" alt="E-Course icon" width={24} height={24} />
//       ),
//     },
//     {
//       href: "/dashboard-bisik",
//       label: "Bisik Forum",
//       icon: (
//         <Image
//           src="/beranda.png"
//           alt="Bisik Forum icon"
//           width={24}
//           height={24}
//         />
//       ),
//     },
//     {
//       href: "/dashboard-podcast",
//       label: "Podcast",
//       icon: (
//         <Image src="/beranda.png" alt="Podcast icon" width={24} height={24} />
//       ),
//     },
//     {
//       href: "/dashboard-event-tersedia",
//       label: "Event",
//       icon: (
//         <Image src="/beranda.png" alt="Event icon" width={24} height={24} />
//       ),
//     },
//     {
//       href: "/dashboard-news",
//       label: "Berita Terkini",
//       icon: (
//         <Image
//           src="/beranda.png"
//           alt="Berita Terkini icon"
//           width={24}
//           height={24}
//         />
//       ),
//     },
//     {
//       href: "/dashboard-artikel",
//       label: "Artikel Interaktif",
//       icon: (
//         <Image
//           src="/beranda.png"
//           alt="Artikel Interaktif icon"
//           width={24}
//           height={24}
//         />
//       ),
//     },
//     {
//       href: "/dashboard-setting-detail",
//       label: "Pengaturan",
//       icon: <Settings className="w-6 h-6" />,
//     },
//   ];

//   return (
//     <aside className="w-[312px] bg-sidebar text-sidebar-foreground flex flex-col h-full fixed top-0 left-0">
//       <div className="flex flex-col flex-grow justify-between">
//         <div className="flex-shrink-0">
//           <div className="flex items-center gap-4 pl-6 pr-5 pt-8">
//             <Image
//               src="/beranda.png?"
//               alt="KEMENDUKBANGGA/BKKBN Logo"
//               width={42}
//               height={42}
//             />
//             <p className="text-brand-header uppercase">KEMENDUKBANGGA/BKKBN</p>
//           </div>
//           <nav className="mt-[56px] px-4">
//             <div className="flex flex-col gap-2">
//               {navItems.map((item) => (
//                 <NavItem key={item.label} {...item} />
//               ))}
//             </div>
//           </nav>
//         </div>
//         <div className="flex-shrink-0">
//           <div className="px-6">
//             <hr className="border-t border-white/20" />
//           </div>
//           <div className="flex items-center justify-between p-6">
//             <div className="flex items-center gap-3">
//               <Image
//                 src="/beranda.png?"
//                 alt="Fitrie Arianti avatar"
//                 width={48}
//                 height={48}
//                 className="rounded-full"
//               />
//               <div>
//                 <p className="text-user-profile-name">Fitrie Arianti</p>
//                 <p className="text-user-profile-email text-footer-text">
//                   fitriarianti@gmail.com
//                 </p>
//               </div>
//             </div>
//             <Link href="/" aria-label="Logout">
//               <LogOut className="w-5 h-5 text-sidebar-foreground" />
//             </Link>
//           </div>
//           <p className="text-footer text-footer-text text-center px-6 pb-4">
//             Copyright © 2025 All right reserved.
//           </p>
//         </div>
//       </div>
//     </aside>
//   );
// };

// export default SidebarNavigation;
