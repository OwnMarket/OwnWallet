import {trigger, animate, style, group, animateChild, query, stagger, transition} from '@angular/animations';

export const routerTransition = trigger('routerTransition', [
  transition('* <=> *', [

    /* 1 */ query(':enter, :leave',
              style({ position: 'fixed', width: '100%' }),
              { optional: true }),

    /* 2 */ group([

      query(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('0.5s ease-in-out', style({ transform: 'translateX(0%)', opacity: 1 }))
      ], { optional: true }),

      query(':leave', [
        style({ transform: 'translateX(0%)' }),
        animate('0.5s ease-in-out', style({ transform: 'translateX(-100%)', opacity: 0 })),
      ], { optional: true }),

    ])
  ])
]);
