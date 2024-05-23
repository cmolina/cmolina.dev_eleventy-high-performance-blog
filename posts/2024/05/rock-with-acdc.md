---
title: "Rock Your Code with AC/DC: Acceptance Criteria Designed Coding"
description: "Today I am sharing a new technique I’ve been crafting for the past few years, that has allowed me to move fast in projects while maintaining high code quality"
date: 2024-05-22
layout: layouts/post.njk
templateEngineOverride: md
---

Welcome to the world of AC/DC, where coding meets rock 'n' roll! No, we’re not talking about shredding guitars or belting out high notes. This <abbr title="Acceptance Criteria Designed Coding">AC/DC</abbr> stands for _Acceptance Criteria Designed Coding_, a new technique I’ve been crafting for the past few years. It’s a nod to the legendary band, and a cheeky jab at [TDD](https://martinfowler.com/bliki/TestDrivenDevelopment.html) fans. Buckle up and get ready to rock your coding workflow!


## The Power Chords of AC/DC

Let’s break down the process and get you rocking.

1. **Grab an Acceptance Criteria (AC) from a Story**

2. **List all its cases**. Create a playlist of _scenarios_. Make sure you keep this list up-to-date as you learn and discover new edge cases

3. **Pick a case, and write it in code following these rules:**
   - **Design the ideal signature**. Make sure to use the same language of the AC
   - **Asserting _behavior_, never _implementation_**: We’re here to rock the stage, not worry about the backstage setup
   - Use **Arrange, Act, Assert**: Your three-step dance routine.

4. **Make sure the new AC’s case is failing:** If it’s not failing, it’s not rocking hard enough.

5. **Write the minimum amount of code** to make the AC’s case pass: Think minimalistic, like a raw guitar riff.

6. **Optional refactor:** Clean up your code and make it smooth.

7. **Confirm all AC's cases are passing:** Like hitting are the right notes!

8. **If there are still cases unimplement, go back to step 3**. There is more rocking to do

6. **Next AC, Please:** Once you’re done, grab the next AC from the story and start over. It is time for a new hit

![](/img/2024/05/acdc-diagram.svg)

## Why Use AC/DC?
Following AC/DC ensures you address all the ACs from a story. If they ever break, you’ll be notified immediately – no more surprise bugs halfway through your concert. This technique has allowed me to move fast in projects while maintaining high code quality.

# Let's Rock an Example

Let’s say we’re grabbing a story for calculating the total price of items in a cart, including tax, in a JavaScript app. Here’s how we’d rock this with AC/DC.

## Step-by-Step

1. Grab an AC from a story: Calculate the total price of items in a cart, including a fixed tax rate of 10%.

2. List all its cases:
    - An empty cart should return 0
    - A cart with one item of price 100 should return 110 (including tax)
    - A cart with multiple items should sum up all prices and add tax

3. Pick a case: Let’s start with an empty cart.

<div class="code-filename">calculateTotalPrice.test.js</div>

``` javascript
import { describe, it, expect } from 'vitest';
import { calculateTotalPrice } from './calculateTotalPrice';

it('should return 0 for an empty cart', () => {
  // Arrange
  const cart = [];

  // Act
  const result = calculateTotalPrice(cart);

  // Assert
  expect(result).toBe(0);
});
```

4. Make sure the new AC’s case is failing: Run the test to see it fail.

``` bash
vitest run
```

5. Write the minimum amount of code to make the AC’s case pass:

<div class="code-filename">calculateTotalPrice.test.js</div>

``` javascript
export function calculateTotalPrice(cart) {
  return 0; // minimum code to pass the test
}
```

6. Optionally refactor: No need yet.

7. Confirm all AC’s cases are passing: Run the test again.

``` bash
vitest run
```

8. If there are still cases unimplemented, go back to step 3: Next case!
<div class="code-filename">calculateTotalPrice.test.js</div>

``` javascript
it('should return 110 for a cart with one item priced at 100', () => {
  const cart = [{ price: 100 }];

  const result = calculateTotalPrice(cart);

  expect(result).toBe(110);
});
```

Run the test to see it fail, then write the minimal code:

<div class="code-filename">calculateTotalPrice.js</div>

``` javascript
export function calculateTotalPrice(cart) {
  if (cart.length === 0) return 0;
  return cart[0].price * 1.1; // minimal code to pass the second test
}
```

Once you write the last case, you may end up with a function like this:

<div class="code-filename">calculateTotalPrice.js</div>

``` javascript
export function calculateTotalPrice(cart) {
  if (cart.length === 0) return 0;
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  return total * 1.1;
}
```

6. Optional refactor. We can replace the 1.1 _magic number_ into a well-named constant:

<div class="code-filename">calculateTotalPrice.js</div>

``` javascript
const TAX_RATE = 1.1;

export function calculateTotalPrice(cart) {
  if (cart.length === 0) return 0;
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  return total * TAX_RATE;
}
```

7. Confirm all tests are passing, and move on to the next AC with step 9.

# Why AC/DC Rocks

Following AC/DC ensures you cover all the acceptance criteria in a user story, providing a safety net that alerts you if any criteria ever break. This technique lets you move fast in projects while maintaining stellar code quality. It’s like having your own coding concert where every function hits the perfect note.

So, turn up the volume on your coding skills and give AC/DC a spin. You might just find yourself rocking out more efficient, reliable, and downright awesome code. Rock on! 🎸
