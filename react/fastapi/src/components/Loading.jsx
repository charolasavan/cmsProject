import React from "react";
import { OrbitProgress } from 'react-loading-indicators';

function Loading() {
  return (
    <div className="h-100 d-flex justify-content-center align-items-center">
      <OrbitProgress
        variant="disc"
        color="#20bfdf"
        size="medium"
        text="Loading..."
        textColor="#333"
      />
    </div>
  );
}

export default Loading;
