type Source = {
  src: string;
  x?: number;
  y?: number;
  opacity?: number;
};

type Options = {
  format: string;
  quality: number;
  width: number;
  height: number;
  crossOrigin?: string;
  rtn: "blob" | "dataURL";
};

const defaultOptions: Options = {
  format: "image/png",
  quality: 0.92,
  width: 360,
  height: 360,
  crossOrigin: undefined,
  rtn: "dataURL",
};

// only for web
const mergeImages = (
  sources: Array<Source | string> = [],
  _options: Partial<Options> = {}
) => {
  return new Promise<Blob | null | string>((resolve) => {
    const options: Options = Object.assign({}, defaultOptions, _options);
    const canvas = window.document.createElement("canvas");
    const Image = window.Image;

    // Load sources
    const tasks = sources.map((source) => {
      return new Promise<Source & { img: HTMLImageElement }>(
        (resolve, reject) => {
          if (typeof source === "string") {
            source = { src: source } as Source;
          }

          const img = new Image(options.width, options.height);
          img.crossOrigin = options.crossOrigin || null;
          img.onerror = () =>
            reject(
              new Error(`Couldn't load image!\n${JSON.stringify(source)}`)
            );
          img.onload = () => resolve(Object.assign({}, source, { img }));

          img.src = source.src;
        }
      );
    });

    // Get canvas context
    const ctx = canvas.getContext("2d");
    canvas.width = options.width;
    canvas.height = options.height;

    // When sources have loaded
    Promise.all(tasks).then((images) => {
      images.forEach((image) => {
        ctx.globalAlpha = image.opacity ? image.opacity : 1;
        ctx.drawImage(image.img, image.x || 0, image.y || 0);
      });

      if (options.rtn === "blob") {
        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          options.format,
          options.quality
        );
      } else {
        resolve(canvas.toDataURL(options.format, options.quality));
      }
    });
  });
};

export default mergeImages;
