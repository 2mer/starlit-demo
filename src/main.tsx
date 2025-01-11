import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './ThemeProvider.tsx'

import { extend, ReactThreeFiber } from '@react-three/fiber';
import { Line } from 'three';

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";


gsap.registerPlugin(useGSAP);

// Add class `Line` as `Line_` to react-three-fiber's extend function. This
// makes it so that when you use <line_> in a <Canvas>, the three reconciler
// will use the class `Line`
extend({ Line_: Line });

// declare `line_` as a JSX element so that typescript doesn't complain
declare global {
	namespace JSX {
		interface IntrinsicElements {
			'line_': ReactThreeFiber.Object3DNode<Line, typeof Line>,
		}
	}
}

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<ThemeProvider>
			<App />
		</ThemeProvider>
	</StrictMode>,
)
