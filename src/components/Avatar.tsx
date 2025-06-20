export const Avatar = ({ src, size = 32 }: { src: string, size?: number }) => {
  // Use a square flex container with center alignment and no margin collapse
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        marginRight: 4,
        verticalAlign: "middle",
        boxSizing: "content-box",
        lineHeight: 0 // Ensures no extra space below images
      }}
      className="align-middle mr-1"
    >
      {src && src.trim() !== "" ? (
        <img
          src={src}
          width={size}
          height={size}
          style={{
            objectFit: "contain",
            display: "block",
            maxWidth: "100%",
            maxHeight: "100%",
            verticalAlign: "middle",
            margin: 0,
            padding: 0
          }}
          className="rounded-full"
        />
      ) : (
        <span
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            background: "#e2e8f0",
            display: "block"
          }}
        />
      )}
    </span>
  );
};
