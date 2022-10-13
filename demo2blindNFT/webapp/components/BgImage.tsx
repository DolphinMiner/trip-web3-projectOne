import Image from "next/image";
import dolphin from "../public/dolphin.png";
import bg_right from "../public/sea_bg_right.png";

const BgImage = () => {
  return (
    <div className="absolute right-0 bottom-0 left-0 top-0">
      <div className="relative w-full h-full">
        {/* sea background */}
        <div className="block relative overflow-hidden w-full h-full ">
          <div className="absolute -bottom-15 -right-10">
            <Image src={bg_right} alt="bg_right" width={680} height={870} />
          </div>
        </div>

        {/* dolphin */}
        <div className="absolute -bottom-10 -right-20">
          <Image src={dolphin} alt="dolphin" width={580} height={470} />
        </div>
      </div>
    </div>
  );
};

export default BgImage;
