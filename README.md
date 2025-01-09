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

