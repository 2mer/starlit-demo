import Scene from './Scene';
import { Canvas } from '@react-three/fiber';
import PodPhase from './phases/Pod';
import { Phase } from './Phase';
import LocationPhase from './phases/LocationPhase';
import { useStore } from './store';
import starlitLogoUrl from './assets/starlitLogo.svg'
import DatePhase from './phases/DatePhase';
import TimePhase from './phases/TimePhase';
import { Github } from 'lucide-react';

const Pages: Partial<Record<Phase, any>> = {
	POD: PodPhase,
	LOCATION: LocationPhase,
	DATE: DatePhase,
	TIME: TimePhase,
}

function App() {
	const { phase } = useStore();

	const CurrentPage = Pages[phase];

	return (
		<>
			<div className='w-full h-full bg-black relative flex'>
				<div className='relative flex bg-black z-10 w-[50vw]'>
					<div className='flex flex-col'>
						<img src={starlitLogoUrl} className='ml-10 mt-10 h-[24px] w-fit' />
						<CurrentPage />
					</div>

					<div className='absolute left-[100%] top-0 flex w-[300px] h-full pointer-events-none' style={{
						backdropFilter: 'blur(10px)',
						background: 'linear-gradient(to right, black 0%, transparent 30%)',
						maskImage: 'linear-gradient(to right, black, transparent)'
					}} />
					{/* <img src={radiusSvg} className='h-full' /> */}
				</div>

				<Canvas>
					<Scene />
				</Canvas>

				<div className='relative flex w-[300px] flex-col'>
					<div className='absolute right-[100%] top-0 flex w-[300px] h-full pointer-events-none' style={{
						backdropFilter: 'blur(10px)',
						background: 'linear-gradient(to left, black 0%, transparent 30%)',
						maskImage: 'linear-gradient(to left, black, transparent)'
					}} />


					<div className='mt-auto ml-auto p-4 flex flex-col items-end gap-10'>
						<div>by <a href="https://2mer.github.io/">Tomer Atar</a></div>
						<div className='text-end'>images from <a href="https://planetpixelemporium.com/">planetpixelemporium.com</a></div>
					</div>
				</div>
			</div>
		</>
	)
}

export default App
