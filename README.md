# react-native-intersection-observer
Exposes a component which is aware of its intersection with the parent viewport or default react-root viewport

### Idea
1. The idea is to expose a component which is aware of its intersection with the parent viewport or default react-root 
viewport. To achieve this, we set up a timer which checks the intersection of the component with the parent viewport at
regular intervals by calling measure on the component's ref.
2. We set up this timer when the component is mounted, and it's native view is accessible via component's ref.
and measure can be called on it, and clear the timer when the component is unmounted.

### Pros
1. Integration is simple and the component is easy to use.

### Cons
1. We are setting up interval to every component which we want to observe which can keep JS virtual 
machine busy and can consume CPU cycles. However, this doesn't block the main thread.

## Code Example
```javascript
    import React from 'react';

    import IntersectionObserver from 'react-native-intersection-observer';
    
    const RenderBanner = () => {
      return (
        <View>
          <Text>Some Text</Text>
        </View>
      );
    };
    const BannerWithIntersectionObserver = () => {
      // onView
      const onViewHandler = (isVisible, viewedOnce) => {
        // isVisible : boolean, viewedOnce : boolean
      };
      return (
        <IntersectionObserver onChange={onViewHandler} delay={500}>
          <RenderBanner/>
        </IntersectionObserver>
        // Always pass verticalThreshold and horizontalThreshold values between 0 and 1
        // [left, right] for horizontalThreshold and [top, bottom] for verticalThreshold
        // props are :
        // 1. onChange [optional]
        // 2. delay [optional, in ms, default is 500]
        // 3. verticalIntersectionRatioRange [optional, default is [1, 1]]
        //    [0.8, 1.0] means 80% to 100% of the component is visible in vertical direction
        //    [0.0, 0.2] means 0% to 20% of the component is visible in vertical direction
        //    [0.2, 0.8] means 20% to 80% of the component is visible in vertical direction
        //    [0.0, 1.0] means 0% to 100% of the component is visible in vertical direction 
        //    [1, 1] means 100% of the component is visible in vertical direction
        //    component is considered visible if it's intersection ratio is within

        // 4. horizontalIntersectionRatioRange [optional, default is [1, 1]]
        //    [0.8, 1.0] means 80% to 100% of the component is visible in horizontal direction
        //    [0.0, 0.2] means 0% to 20% of the component is visible in horizontal direction
        //    [0.2, 0.8] means 20% to 80% of the component is visible in horizontal direction
        //    [0.0, 1.0] means 0% to 100% of the component is visible in horizontal direction
        //    [1, 1] means 100% of the component is visible in horizontal direction
        //    component is considered visible if it's intersection ratio is within 
        //    this range
        // 5. parentRect : { top, left, right, bottom } [optional]
        //    top, left, right, bottom are the coordinates of the parent viewport
      );
    }
```
