import React from 'react';
import Lottie from "lottie-react";
import LoadingAnimation from "@/public/animations/LoadingApp.json";

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <Lottie
        animationData={LoadingAnimation}
        loop={true}
        className="size-32"
      />
    </div>
  );
}

export default Loading;