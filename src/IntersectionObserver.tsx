import React, { useEffect, useRef } from 'react';
import { Dimensions, View } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default (props: IntersectionObserverProps) => {
  const intersectionObserverRef: IntersectionObserverRef = useRef({
    intervalCallback: null,
    componentRef: null,
    viewedOnce: false,
    visible: false,
  }).current;

  // start watching for visibility
  const startWatching = () => {
    intersectionObserverRef.intervalCallback = setInterval(() => {
      intersectionObserverRef.componentRef.measure((_x: number, _y: number, width: number, height: number, pageX: number, pageY: number) => {
        isInViewPort({
          bottom: pageY + height,
          right: pageX + width,
          height: height,
          width: width,
          left: pageX,
          top: pageY,
        });
      });
    }, props.delay ?? 500);
  };

  // stop watching for visibility
  const stopWatching = () => {
    if (intersectionObserverRef.intervalCallback) {
      clearInterval(intersectionObserverRef.intervalCallback);
      intersectionObserverRef.intervalCallback = null;
    }
    intersectionObserverRef.componentRef = null;
    intersectionObserverRef.viewedOnce = false;
    intersectionObserverRef.visible = false;
  };

  // check if component is in view port
  const isInViewPort = (currentRect: Rectangle) => {
    const { parentRect } = props;
    const { verticalIntersectionRatio, horizontalIntersectionRatio } = calculateIntersectionRatio(currentRect, {
      top: parentRect?.top ?? 0,
      left: parentRect?.left ?? 0,
      right: parentRect?.right ?? windowWidth,
      bottom: parentRect?.bottom ?? windowHeight,
      width: parentRect?.width ?? windowWidth,
      height: parentRect?.height ?? windowHeight,
    });

    const verticalIntersectionRatioRange = [props.verticalIntersectionRatioRange?.[0] ?? 1, props.verticalIntersectionRatioRange?.[1] ?? 1];
    const horizontalIntersectionRatioRange = [props.horizontalIntersectionRatioRange?.[0] ?? 1, props.horizontalIntersectionRatioRange?.[1] ?? 1];

    const isVisible =
      verticalIntersectionRatio >= verticalIntersectionRatioRange[0] &&
      verticalIntersectionRatio <= verticalIntersectionRatioRange[1] &&
      horizontalIntersectionRatio >= horizontalIntersectionRatioRange[0] &&
      horizontalIntersectionRatio <= horizontalIntersectionRatioRange[1];

    if (intersectionObserverRef.visible !== isVisible) {
      intersectionObserverRef.visible = isVisible;
      props.onChange?.(isVisible, intersectionObserverRef.viewedOnce);
      intersectionObserverRef.viewedOnce = true;
    }
  };

  useEffect(() => {
    return stopWatching;
  }, []);

  return (
    <View
      collapsable={false}
      ref={(nativeComponent: any) => {
        // this callback is called on every render when react component is mounted or updated
        // nativeComponent is the reference to the native component (View) that is rendered by
        // this React component
        // 1. get reference to the native component on initial mount
        // 2. start watching for visibility
        // 3. stop watching when component is unmounted (check useEffect return statement)
        if (nativeComponent) {
          if (intersectionObserverRef.componentRef === null) {
            intersectionObserverRef.componentRef = nativeComponent;
            startWatching();
          }
        }
      }}
    >
      {props.children}
    </View>
  );
};

/* intersection observer logic : it computes how much the main rectangle is intersecting with the
   bounding / parent rectangle via returning intersection ratio in both directions (vertical and
   horizontal)
*/
const calculateIntersectionRatio = (mainRect: Rectangle, boundingRect: Rectangle) => {
  const topBoundary = Math.min(Math.max(mainRect.top, boundingRect.top), boundingRect.bottom);
  const bottomBoundary = Math.max(Math.min(mainRect.bottom, boundingRect.bottom), boundingRect.top);
  let verticalIntersectionRatio = (bottomBoundary - topBoundary) / mainRect.height;
  verticalIntersectionRatio = Math.max(Math.min(verticalIntersectionRatio, 1), 0);

  const leftBoundary = Math.min(Math.max(mainRect.left, boundingRect.left), boundingRect.right);
  const rightBoundary = Math.max(Math.min(mainRect.right, boundingRect.right), boundingRect.left);
  let horizontalIntersectionRatio = (rightBoundary - leftBoundary) / mainRect.width;
  horizontalIntersectionRatio = Math.max(Math.min(horizontalIntersectionRatio, 1), 0);

  return {
    verticalIntersectionRatio,
    horizontalIntersectionRatio,
  };
};

interface IntersectionObserverProps {
  children: React.ReactNode;
  onChange?: (isVisible: boolean, viewedOnce: boolean) => void;
  horizontalIntersectionRatioRange?: [number, number];
  verticalIntersectionRatioRange?: [number, number];
  parentRect?: Rectangle;
  delay?: number;
}

interface Rectangle {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

interface IntersectionObserverRef {
  intervalCallback: NodeJS.Timeout | null;
  componentRef: any;
  viewedOnce: boolean;
  visible: boolean;
}
