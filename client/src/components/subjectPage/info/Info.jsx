const Info = ({ info, titleFontSize }) => {
  const baseFontSize = titleFontSize || 20;
  const isTopLevel = titleFontSize >= 20;

  return (
    <div className="space-y-6">
      {info.map((item, index) => (
        <div 
          key={index} 
          className={`${isTopLevel ? 'border-b border-gray-200 pb-6 last:border-b-0 last:pb-0' : 'pl-4 md:pl-6 border-r-2 border-indigo-200 pr-4 md:pr-6'}`}
        >
          {/* Title */}
          <h3 
            className={`font-bold text-gray-800 mb-3 text-right ${
              isTopLevel 
                ? 'text-2xl md:text-3xl' 
                : baseFontSize >= 18 
                  ? 'text-xl md:text-2xl' 
                  : 'text-lg md:text-xl'
            }`}
            style={{ fontSize: `${baseFontSize}px` }}
          >
            {item.infoTitle}
          </h3>
          
          {/* Description */}
          <p className="text-gray-700 leading-relaxed mb-4 text-right text-base md:text-lg">
            {item.infoDescription}
          </p>
          
          {/* Sub Info (Recursive) */}
          {item.subInfo && (
            <div className="mt-4">
              <Info info={item.subInfo} titleFontSize={baseFontSize - 4} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Info;
