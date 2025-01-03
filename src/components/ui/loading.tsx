import React from 'react';
import Lottie from "lottie-react";
import LoadingAnimation from "@/public/animations/LoadingApp.json";

const Loading = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Lottie
        animationData={LoadingAnimation}
        loop={true}
        className="size-20"
      />
    </div>
  );
}

export { Loading };