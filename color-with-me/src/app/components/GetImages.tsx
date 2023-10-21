import React, { useEffect, useState } from "react";
import Image from "next/image";

const GetImages = ({
  onSelectedImage,
}: {
  onSelectedImage: (image: string) => void;
}) => {
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the images from the API route without specifying the full URL
    fetch("/api/images") // This path is relative to your project
      .then((response) => response.json())
      .then((data) => {
        setImages(data);
      })
      .catch((error) => {
        console.error("Error fetching images:", error);
      });
  }, []);

  const handleImageClick = (image: string) => {
    onSelectedImage(image);
    setSelectedImage(image);
  };

  return (
    <div className="p-3">
      <div className="grid grid-cols-3 gap-4">
        {images.map((filename, index) => (
          <div
            key={index}
            className={
              selectedImage === filename
                ? "border-4 border-blue-500 rounded-3xl"
                : "border-4 border-gray-500 rounded-3xl"
            }
            style={{
              width: "250px", // Set a fixed width for the image container
              height: "250px", // Set a fixed height for the image container
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden", // Hide any overflow
              objectFit: "cover",
            }}
          >
            <Image
              src={`/images/${filename}`}
              alt={filename}
              width={250}
              height={250}
              className="rounded-3xl"
              onClick={() => handleImageClick(filename)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetImages;
