# WebCraft

## Description

Welcome to the Performance-Optimized UI Components Library – a collection of web components designed with a focus on performance, leveraging the power of Virtual DOM.

## Features

- High-performance UI web components.
- Efficient rendering using Virtual DOM.
- [Add other features of your library]

## Installation

You can install the library using npm:

```bash
npm i webcraft-ui
```

## Example Usage

```typescript
import { InputNumber } from 'webcraft-ui';

const speed = new InputNumber({
  label: 'Speed',
  suffix: ' km/h',
  numberType: 'integer',
  icon: 'fa-solid fa-gauge-high',
  value: 250,
});

const currency = new InputNumber({
  label: 'Value',
  suffix: ' $',
  numberType: 'decimal',
  value: 85000.99,
  icon: 'fa-solid fa-coins',
});

speed.mount();
currency.mount();

```

## Examples

List of samples is there:
https://stackblitz.com/@PrzemekNiedziela/collections/webcraft
