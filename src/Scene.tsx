import React, { ElementRef, useEffect, useMemo, useRef, useState } from "react";
import { AdditiveBlending, Color, Raycaster, TextureLoader, Vector2, Vector3 } from "three";
import earthMapUrl from "./assets/earthmap1k.jpg";
import earthSpecMapUrl from "./assets/earthspec1k.jpg";
import earthBumpMapUrl from "./assets/earthbump1k.jpg";
import earthLightMapUrl from "./assets/earthlights1k.jpg";
import earthCloudMapUrl from "./assets/earthcloudmap.jpg";
import earthCloudMapAlphaUrl from "./assets/earthcloudmaptrans.jpg";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import getStarfield from "./util/genStarfield";
import { useStore } from "./store";
import { Phase } from "./Phase";
import { PAYLOADS } from "./data";

const loader = new TextureLoader();

const fresnel = {
	uniforms: {
		color: { value: new Color(0xffffff) },
	},
	vertex: `
				precision mediump float;
				varying vec3 vNormal;
				varying vec3 vEye;

				void main(){
					vNormal = normalize(normalMatrix * normal);
					vEye = normalize(vec3(modelViewMatrix * vec4(position, 1.0)).xyz);
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}
	`,
	fragment: `
				precision mediump float;
				varying vec3 vNormal;
				varying vec3 vEye;
				uniform vec3 color;

				void main(){
					vec3 fresnelColor = color;
					float a = ( 1.0 - -min(dot(vEye, normalize(vNormal) ), 0.0) );
					a = pow(a, 2.);
					gl_FragColor = vec4(fresnelColor, a) ;
				}
	`,


}



function Scene() {
	const { phase, pod, location, setLocation, sun } = useStore();
	const { scene, size, gl } = useThree();



	const mouse = useMemo(() => new Vector2(), []);
	const targetDir = useMemo(() => new Vector3(), []);
	const targetPos = useMemo(() => new Vector3(), []);

	const raycaster = useMemo(() => new Raycaster(), []);
	const earthTexture = useMemo(() => loader.load(earthMapUrl), [])
	const earthSpecTexture = useMemo(() => loader.load(earthSpecMapUrl), [])
	const earthBumpTexture = useMemo(() => loader.load(earthBumpMapUrl), [])
	const earthLightTexture = useMemo(() => loader.load(earthLightMapUrl), [])
	const earthCloudTexture = useMemo(() => loader.load(earthCloudMapUrl), [])
	const earthCloudAlphaTexture = useMemo(() => loader.load(earthCloudMapAlphaUrl), [])
	const stars = useMemo(() => getStarfield({ numStars: 2000 }), []);


	const lineRef = useRef<ElementRef<'line_'>>(null);
	const earthRef = useRef<ElementRef<'mesh'>>(null);
	const cloudsRef = useRef<ElementRef<'mesh'>>(null);
	const interactionSphereRef = useRef<ElementRef<'mesh'>>(null);
	const pickSphereRef = useRef<ElementRef<'mesh'>>(null);
	const lightGroupRef = useRef<ElementRef<'group'>>(null);

	function onMouseMove(event: any) {
		const bounds = gl.domElement.getBoundingClientRect();
		mouse.x = ((event.clientX - bounds.x) / size.width) * 2 - 1;
		mouse.y = -((event.clientY - bounds.y) / size.height) * 2 + 1;
	}

	useEffect(() => {
		window.addEventListener('mousemove', onMouseMove);

		return () => {
			window.addEventListener('mousemove', onMouseMove);
		}
	}, [])

	const targetingDistance = 1.6;

	useFrame(({ camera }) => {
		const line = lineRef.current!;
		const earthSphere = earthRef.current!;
		const interactionSphere = interactionSphereRef.current!;

		raycaster.setFromCamera(mouse, camera);

		const intersects = raycaster.intersectObject(earthSphere);

		if (intersects.length > 0 && phase === Phase.LOCATION && !location) {
			const intersectionPoint = intersects[0].point;

			targetDir
				.copy(earthSphere.position)
				.sub(intersectionPoint)
				.multiplyScalar(-1)
				.normalize();

			targetPos
				.copy(earthSphere.position)
				.addScaledVector(targetDir, targetingDistance)

			// Update Interaction Sphere
			interactionSphere.position.copy(targetPos);
			interactionSphere.visible = true;

			pickSphereRef.current!.position.copy(targetPos);


			// Update Line
			const linePoints = [targetPos, earthSphere.position];
			line.geometry.setFromPoints(linePoints);
			line.computeLineDistances();
			line.visible = true;
		} else {
			interactionSphere.visible = false;
			line.visible = false;
		}

		pickSphereRef.current!.visible = Boolean(location);

		const clouds = cloudsRef.current!;
		clouds.rotation.y += 0.0003;
		stars.rotation.y -= 0.0001;
	})

	const glowUniforms = React.useMemo(() => ({ color: { value: new Color(0x7aa9f5) } }), [])

	const focusPos = location ?? earthRef?.current?.position

	const isClickRef = useRef(false);

	const controlsRef = useRef<ElementRef<typeof OrbitControls>>(null);

	useGSAP(() => {
		gsap.to(controlsRef.current!.target, focusPos ?? new Vector3())
	}, [focusPos])


	useEffect(() => {
		scene.add(stars);
	}, [scene])

	const pickUniforms = useMemo(() => {

		return { color: { value: new Color() } }
	}, []);

	useEffect(() => {
		if (pod) {
			const newColor = new Color(PAYLOADS[pod].color);


			pickSphereRef.current!.material.uniforms.color.value.copy(newColor);
		}
	}, [pod])

	useEffect(() => {
		lightGroupRef.current!.rotation.y = (Math.PI * 2) * sun;
	}, [sun])

	return (
		<>

			<group ref={lightGroupRef}>
				<directionalLight args={[0xffffff, 2.0]} position={[-2, 0.5, 1.5]} />
			</group>

			<OrbitControls ref={controlsRef} enablePan={false} enableZoom={false} />

			{/* earth sphere */}
			<group>
				<mesh
					ref={earthRef}
					onPointerDown={() => {
						isClickRef.current = true;
					}}
					onPointerMove={(e) => {
						isClickRef.current = false;
					}}
					onClick={(e) => {
						if (isClickRef.current) {
							setLocation(new Vector3().copy(targetPos))
						}
					}}
				>
					<icosahedronGeometry args={[1, 12]} />
					<meshPhongMaterial map={earthTexture} specularMap={earthSpecTexture} bumpMap={earthBumpTexture} bumpScale={0.04} />
				</mesh>
				<mesh>
					<icosahedronGeometry args={[1.01, 12]} />
					<meshBasicMaterial map={earthLightTexture} blending={AdditiveBlending} />
				</mesh>
				<mesh ref={cloudsRef}>
					<icosahedronGeometry args={[1.02, 12]} />
					<meshStandardMaterial map={earthCloudTexture} blending={AdditiveBlending} transparent opacity={0.2} alphaMap={earthCloudAlphaTexture} />
				</mesh>

				{/* earth fresnel */}
				<mesh>
					<icosahedronGeometry args={[1.03, 12]} />
					<shaderMaterial transparent vertexShader={fresnel.vertex} fragmentShader={fresnel.fragment} uniforms={glowUniforms} />
				</mesh>
			</group>


			{/* indicator */}
			<group>
				<line_ ref={lineRef}>
					<lineDashedMaterial {...{ color: 0xffffff, dashSize: 0.01, gapSize: 0.04 }} />
					<bufferGeometry />
				</line_>

				<mesh ref={interactionSphereRef}>
					<icosahedronGeometry args={[0.1, 12]} />
					<shaderMaterial transparent vertexShader={fresnel.vertex} fragmentShader={fresnel.fragment} uniforms={fresnel.uniforms} />
				</mesh>

				<mesh ref={pickSphereRef}>
					<icosahedronGeometry args={[0.1, 12]} />
					<shaderMaterial transparent vertexShader={fresnel.vertex} fragmentShader={fresnel.fragment} uniforms={pickUniforms} />
				</mesh>
			</group>
		</>
	)
}

export default Scene;