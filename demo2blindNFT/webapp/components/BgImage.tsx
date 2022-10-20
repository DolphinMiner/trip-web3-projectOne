/* eslint-disable @next/next/no-img-element */

const BgImage = () => {
  return (
    <div className="absolute right-0 bottom-0 left-0 top-0">
      <div className="relative w-full h-full">
        {/* sea background */}
        <div className="block relative overflow-hidden w-full h-full ">
          <div className="absolute -bottom-15 -right-10">
            <img src="/sea_bg_right.png" alt="bg_right" width="680" height="870" />
          </div>
        </div>

        {/* dolphin */}
        <div className="absolute -bottom-10 -right-20">
          <img src="/dolphin.png" alt="dolphin" width="580" height="470" />
        </div>
      </div>
    </div>
  );
};

export default BgImage;
