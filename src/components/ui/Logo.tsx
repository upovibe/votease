import React from "react";
import Image from "next/image";
import Link from "next/link";
import LogoImage from "@/public/logo.svg";

const Logo = () => {
  return (
    <Link href="/dashboard">
      <Image
        src={LogoImage}
        alt="VoteEase Logo"
        width={35}
        height={35}
        className="bg-white rounded "
      />
    </Link>
  );
};

export default Logo;
