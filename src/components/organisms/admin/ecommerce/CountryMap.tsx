// // react plugin for creating vector maps
// import { VectorMap } from "@react-jvectormap/core";
// import { worldMill } from "@react-jvectormap/world";

// // Define the component props
// interface CountryMapProps {
//   mapColor?: string;
// }

// const CountryMap: React.FC<CountryMapProps> = ({ mapColor }) => {
//   return (
//     <VectorMap
//       map={worldMill}
//       backgroundColor="transparent"
//       markerStyle={{
//         initial: {
//           fill: "#465FFF",
//           r: 4, // Custom radius for markers
//         } as any, // Type assertion to bypass strict CSS property checks
//       }}
//       markersSelectable={true}
//       markers={[
//         {
//           latLng: [37.2580397, -104.657039],
//           name: "United States",
//           style: {
//             fill: "#465FFF",
//             borderWidth: 1,
//             borderColor: "white",
//             stroke: "#383f47",
//           },
//         },
//         {
//           latLng: [20.7504374, 73.7276105],
//           name: "India",
//           style: { fill: "#465FFF", borderWidth: 1, borderColor: "white" },
//         },
//         {
//           latLng: [53.613, -11.6368],
//           name: "United Kingdom",
//           style: { fill: "#465FFF", borderWidth: 1, borderColor: "white" },
//         },
//         {
//           latLng: [-25.0304388, 115.2092761],
//           name: "Sweden",
//           style: {
//             fill: "#465FFF",
//             borderWidth: 1,
//             borderColor: "white",
//             strokeOpacity: 0,
//           },
//         },
//       ]}
//       zoomOnScroll={false}
//       zoomMax={12}
//       zoomMin={1}
//       zoomAnimate={true}
//       zoomStep={1.5}
//       regionStyle={{
//         initial: {
//           fill: mapColor || "#D0D5DD",
//           fillOpacity: 1,
//           fontFamily: "Outfit",
//           stroke: "none",
//           strokeWidth: 0,
//           strokeOpacity: 0,
//         },
//         hover: {
//           fillOpacity: 0.7,
//           cursor: "pointer",
//           fill: "#465fff",
//           stroke: "none",
//         },
//         selected: {
//           fill: "#465FFF",
//         },
//         selectedHover: {},
//       }}
//       regionLabelStyle={{
//         initial: {
//           fill: "#35373e",
//           fontWeight: 500,
//           fontSize: "13px",
//           stroke: "none",
//         },
//         hover: {},
//         selected: {},
//         selectedHover: {},
//       }}
//     />
//   );
// };

// export default CountryMap;
import { VectorMap } from "@react-jvectormap/core";
import { worldMill } from "@react-jvectormap/world";
type JVectorStyle = {
  fill?: string;
  fillOpacity?: number;
  stroke?: string;
  strokeWidth?: number;
  strokeOpacity?: number;
  cursor?: string;
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: number;
  r?: number;
};

type JVectorStyleSet = {
  initial?: JVectorStyle;
  hover?: JVectorStyle;
  selected?: JVectorStyle;
  selectedHover?: JVectorStyle;
};

interface CountryMapProps {
  mapColor?: string;
}

interface CountryMapProps {
  mapColor?: string;
}

const CountryMap = ({ mapColor }: CountryMapProps) => {
  const markerStyle: JVectorStyleSet = {
    initial: {
      fill: "#465FFF",
      r: 4,
    },
  };

  const regionStyle: JVectorStyleSet = {
    initial: {
      fill: mapColor ?? "#D0D5DD",
      fillOpacity: 1,
      fontFamily: "Outfit",
      stroke: "none",
      strokeWidth: 0,
      strokeOpacity: 0,
    },
    hover: {
      fillOpacity: 0.7,
      cursor: "pointer",
      fill: "#465fff",
    },
    selected: {
      fill: "#465FFF",
    },
  };

  return (
    <VectorMap
      map={worldMill}
      backgroundColor="transparent"
      markerStyle={markerStyle}
      regionStyle={regionStyle}
      zoomOnScroll={false}
      zoomMax={12}
      zoomMin={1}
      zoomAnimate
      zoomStep={1.5}
      markers={[
        { latLng: [37.25, -104.65], name: "United States" },
        { latLng: [20.75, 73.72], name: "India" },
        { latLng: [53.61, -11.63], name: "United Kingdom" },
      ]}
    />
  );
};

export default CountryMap;
