<script lang="ts">
	import { mount, onMount, unmount } from 'svelte';
	import ActionMenu from './action-menu.svelte';
	import type { NodeFlowArrow, NodeType } from '$lib/types/nodes';
	import type { CanvasNode, Coordinates } from '$lib/types/canvas';
	import Button from '../button.svelte';
	import { MENU_HEIGHT, MENU_WIDTH } from './value-object';
	import { match, P } from 'ts-pattern';

	type ZoomLevel = number;
	type InputProps = {
		readonly canvasNodes: CanvasNode[];
		readonly nodeFlowArrows: NodeFlowArrow[];
		readonly width: number;
		readonly height: number;
		readonly selectedNode: CanvasNode | undefined;
		onNodeDraw: (...props: any[]) => any;
		onNodeSelected: (...props: any[]) => any;
		onNodeMoved: (...props: any[]) => any;
		onFlowArrowAttached: (...props: any[]) => any;
	};

	const NODE_DIMENSION = 100;
	const MIN_CANVAS_BOUNDARY = -500;
	const MAX_CANVAS_BOUNDARY = 0;
	const ELECTRODE_RADIUS = 4;

	let {
		canvasNodes,
		nodeFlowArrows,
		width,
		height,
		selectedNode,
		onNodeDraw,
		onNodeSelected,
		onNodeMoved,
		onFlowArrowAttached
	}: InputProps = $props();

	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D;

	let editorMode: 'normal' | 'arrow' = $state('normal');
	let zoomLevel: ZoomLevel = $state(1.5);
	let isLeftClickDown: boolean = $state(false);
	let isRightClickDown: boolean = $state(false);
	let globalPosition: { x: number; y: number } = $state({ x: 0, y: 0 });
	let menuCoordinates: { x: number; y: number } = $state({ x: 0, y: 0 });
	let actionMenuMounted: any | undefined = $state.raw(undefined);
	let isMouseWithinNodeBoundaries: boolean = $state(false);
	let maybeElectrodeWithinBoundaries:
		| { node: CanvasNode; electrode: 'anode' | 'cathode' }
		| undefined = $state(undefined);
	let cursor: string = $state('cursor-grab');
	let flowArrowBuffer:
		| {
				arrow: { from: { node: CanvasNode; electrode: 'anode' | 'cathode' }; to: Coordinates };
				state: 'attached' | 'detached';
		  }
		| undefined = $state(undefined);

	onMount(() => {
		context = canvas.getContext('2d')!;
		drawLoop();
	});

	$effect(() => {
		selectedNode;
		nodeFlowArrows;
		drawLoop();
	});

	function drawLoop() {
		context.clearRect(0, 0, canvas.width, canvas.height);
		fillBackground();
		drawReference();
		drawNodes();
		drawFlowArrows();
	}

	function drawFlowArrows() {
		for (let arrow of nodeFlowArrows) {
			const fromNode = canvasNodes.find((node) => node.id === arrow.fromNodeId);
			const toNode = canvasNodes.find((node) => node.id === arrow.toNodeId);
			if (fromNode && toNode) {
				context.beginPath();
				context.moveTo(
					getCathodeCoordinatesForNode(toGlobalCoordinates(fromNode.coordinates)).x,
					getCathodeCoordinatesForNode(toGlobalCoordinates(fromNode.coordinates)).y
				);
				context.lineTo(
					getAnodeCoordinatesForNode(toGlobalCoordinates(toNode.coordinates)).x,
					getAnodeCoordinatesForNode(toGlobalCoordinates(toNode.coordinates)).y
				);
				context.stroke();
				context.fill();
				context.closePath();
			}
		}
		if (flowArrowBuffer) {
			context.beginPath();
			if (flowArrowBuffer.arrow.from.electrode === 'cathode')
				context.moveTo(
					getCathodeCoordinatesForNode(
						toGlobalCoordinates(flowArrowBuffer.arrow.from.node.coordinates)
					).x,
					getCathodeCoordinatesForNode(
						toGlobalCoordinates(flowArrowBuffer.arrow.from.node.coordinates)
					).y
				);
			else
				context.moveTo(
					getAnodeCoordinatesForNode(
						toGlobalCoordinates(flowArrowBuffer.arrow.from.node.coordinates)
					).x,
					getAnodeCoordinatesForNode(
						toGlobalCoordinates(flowArrowBuffer.arrow.from.node.coordinates)
					).y
				);
			context.lineTo(
				fromGlobalCoordinates(flowArrowBuffer.arrow.to).x,
				fromGlobalCoordinates(flowArrowBuffer.arrow.to).y
			);
			context.stroke();
			context.fill();
			context.closePath();
		}
	}

	function toGlobalCoordinates(coordinates: Coordinates): Coordinates {
		return {
			x: coordinates.x * zoomLevel + globalPosition.x,
			y: coordinates.y * zoomLevel + globalPosition.y
		};
	}

	function fromGlobalCoordinates(coordinates: Coordinates): Coordinates {
		return {
			x: (coordinates.x - globalPosition.x) / zoomLevel,
			y: (coordinates.y - globalPosition.y) / zoomLevel
		};
	}

	function drawNode(node: CanvasNode) {
		context.beginPath();
		const nodeGlobalCoordinate = toGlobalCoordinates(node.coordinates);
		context.roundRect(
			nodeGlobalCoordinate.x,
			nodeGlobalCoordinate.y,
			NODE_DIMENSION * zoomLevel,
			NODE_DIMENSION * zoomLevel,
			[5 * zoomLevel]
		);

		context.stroke();
		context.fill();
		context.closePath();
	}

	function getCathodeCoordinatesForNode(nodeCoordinates: Coordinates) {
		return {
			x: nodeCoordinates.x + (NODE_DIMENSION + 5) * zoomLevel,
			y: nodeCoordinates.y + (NODE_DIMENSION / 2) * zoomLevel
		};
	}

	function getAnodeCoordinatesForNode(nodeCoordinates: Coordinates) {
		return {
			x: nodeCoordinates.x - 5 * zoomLevel,
			y: nodeCoordinates.y + (NODE_DIMENSION / 2) * zoomLevel
		};
	}

	function drawAnodes(node: CanvasNode) {
		const nodeGlobalCoordinate = toGlobalCoordinates(node.coordinates);
		context.beginPath();
		context.arc(
			getAnodeCoordinatesForNode(nodeGlobalCoordinate).x,
			getAnodeCoordinatesForNode(nodeGlobalCoordinate).y,
			ELECTRODE_RADIUS * zoomLevel,
			0,
			2 * Math.PI
		);
		context.stroke();
		context.fill();
		context.closePath();
	}

	function drawCathodes(node: CanvasNode) {
		const nodeGlobalCoordinate = toGlobalCoordinates(node.coordinates);
		context.beginPath();
		context.arc(
			getCathodeCoordinatesForNode(nodeGlobalCoordinate).x,
			getCathodeCoordinatesForNode(nodeGlobalCoordinate).y,
			ELECTRODE_RADIUS * zoomLevel,
			0,
			2 * Math.PI
		);
		context.stroke();
		context.fill();
		context.closePath();
	}

	function drawTitle(node: CanvasNode) {
		const nodeGlobalCoordinate = toGlobalCoordinates(node.coordinates);
		context.beginPath();
		context.fillStyle = '#333333';
		context.lineWidth = 1;
		context.strokeStyle = '#101010';
		const fontSize = (12 * zoomLevel).toFixed(0);
		context.font = `${fontSize}px Helvetica`;
		context.fillText(
			node.title,
			nodeGlobalCoordinate.x,
			nodeGlobalCoordinate.y + (NODE_DIMENSION + 15) * zoomLevel
		);
		context.closePath();
	}

	function drawNodes() {
		for (let node of canvasNodes) {
			if (
				editorMode === 'arrow' &&
				maybeElectrodeWithinBoundaries &&
				maybeElectrodeWithinBoundaries.electrode === 'anode' &&
				maybeElectrodeWithinBoundaries.node.id !== node.id
			) {
				context.lineWidth = 5;
				context.strokeStyle = '#339033';
				context.fillStyle = '#33aa33';
			} else if (
				maybeElectrodeWithinBoundaries &&
				maybeElectrodeWithinBoundaries.node.id === node.id &&
				maybeElectrodeWithinBoundaries.electrode === 'cathode'
			) {
				context.lineWidth = 5;
				context.strokeStyle = '#ff9933';
				context.fillStyle = '#f6f6f6';
			} else {
				context.lineWidth = 2;
				context.strokeStyle = '#585858';
				context.fillStyle = '#fdfdfd';
			}
			drawCathodes(node);

			if (
				editorMode === 'arrow' &&
				maybeElectrodeWithinBoundaries &&
				maybeElectrodeWithinBoundaries.electrode === 'cathode' &&
				maybeElectrodeWithinBoundaries.node.id !== node.id
			) {
				context.lineWidth = 5;
				context.strokeStyle = '#339033';
				context.fillStyle = '#33aa33';
			} else if (
				maybeElectrodeWithinBoundaries &&
				maybeElectrodeWithinBoundaries.node.id === node.id &&
				maybeElectrodeWithinBoundaries.electrode === 'anode'
			) {
				context.lineWidth = 5;
				context.strokeStyle = '#ff9933';
				context.fillStyle = '#f6f6f6';
			} else {
				context.lineWidth = 2;
				context.strokeStyle = '#585858';
				context.fillStyle = '#fdfdfd';
			}
			drawAnodes(node);

			if (selectedNode && selectedNode.id === node.id) {
				context.lineWidth = 5;
				context.strokeStyle = '#ff9933';
				context.fillStyle = '#f6f6f6';
			} else {
				context.lineWidth = 2;
				context.strokeStyle = '#585858';
				context.fillStyle = '#fdfdfd';
			}
			drawNode(node);
			drawTitle(node);
		}
	}

	function fillBackground() {
		context.fillStyle = '#fffffa';
		context.fillRect(0, 0, width, height);
	}

	function drawReference() {
		context.beginPath();
		for (let j = globalPosition.y; j < canvas.height; j += 50 * zoomLevel) {
			for (let i = globalPosition.x; i < canvas.width; i += 50 * zoomLevel) {
				context.strokeStyle = '#ffaf44';
				context.lineWidth = 1;
				const fromX = Math.max(i - 3 * zoomLevel, 0);
				const toX = Math.max(i + 3 * zoomLevel, 0);
				context.moveTo(fromX, j);
				context.lineTo(toX, j);

				const fromY = Math.max(j - 3 * zoomLevel, 0);
				const toY = Math.max(j + 3 * zoomLevel, 0);
				context.moveTo(i, fromY);
				context.lineTo(i, toY);

				context.stroke();
			}
		}
		context.closePath();
	}

	function zoomIn() {
		if (zoomLevel < 2.9) zoomLevel += 0.1;
		drawLoop();
	}

	function zoomOut() {
		if (zoomLevel > 1) zoomLevel -= 0.1;
		drawLoop();
	}

	function addFlowArrow(
		from: { node: CanvasNode; electrode: 'anode' | 'cathode' },
		to: Coordinates
	) {
		flowArrowBuffer = {
			arrow: {
				from,
				to
			},
			state: 'detached'
		};
	}

	function move(event: MouseEvent) {
		if (isLeftClickDown) {
			const direction = { x: event.movementX, y: event.movementY };
			if (editorMode === 'arrow') {
				// draw flowArrow
				const from = match(maybeElectrodeWithinBoundaries)
					.with(
						{
							electrode: 'anode'
						},
						(anode) => anode
					)
					.with(
						{
							electrode: 'cathode'
						},
						(cathode) => cathode
					)
					.run();

				addFlowArrow(
					from,
					toGlobalCoordinates({
						x: event.clientX,
						y: event.clientY
					})
				);
			} else if (isMouseWithinNodeBoundaries) {
				if (selectedNode) {
					const newX = selectedNode.coordinates.x + direction.x / zoomLevel;
					const newY = selectedNode.coordinates.y + direction.y / zoomLevel;
					onNodeMoved({ x: newX < 0 ? 0 : newX, y: newY < 0 ? 0 : newY });
				}
			} else {
				const newX = globalPosition.x + direction.x;
				const newY = globalPosition.y + direction.y;
				let boundedX = 0;
				let boundedY = 0;
				if (direction.x < 0) {
					boundedX = Math.max(MIN_CANVAS_BOUNDARY * zoomLevel, newX);
				} else {
					boundedX = Math.min(MAX_CANVAS_BOUNDARY, newX);
				}
				if (direction.y < 0) {
					boundedY = Math.max(MIN_CANVAS_BOUNDARY * zoomLevel, newY);
				} else {
					boundedY = Math.min(MAX_CANVAS_BOUNDARY, newY);
				}
				globalPosition = { x: boundedX, y: boundedY };
			}
			drawLoop();
		} else {
			for (let node of canvasNodes) {
				maybeElectrodeWithinBoundaries = match({
					anodeCollision: computeCollisionForElectrode(
						node,
						{
							x: event.clientX,
							y: event.clientY
						},
						'anode'
					),
					cathodeCollision: computeCollisionForElectrode(
						node,
						{
							x: event.clientX,
							y: event.clientY
						},
						'cathode'
					)
				})
					.with({ anodeCollision: true }, () => ({ node: node, electrode: 'anode' as const }))
					.with({ cathodeCollision: true }, () => ({
						node: node,
						electrode: 'cathode' as const
					}))
					.otherwise(() => undefined);
				if (maybeElectrodeWithinBoundaries) break;
			}
		}
	}

	function addNodeToContext(type: NodeType) {
		const node = {
			id: window.crypto.randomUUID(),
			coordinates: {
				x: fromGlobalCoordinates(menuCoordinates).x - NODE_DIMENSION / 2,
				y: fromGlobalCoordinates(menuCoordinates).y - NODE_DIMENSION / 2
			},
			title: type
		};
		onNodeDraw(node, type);
		destroyActionMenuIfPossible();
		drawLoop();
	}

	function updateMouseStateDependingOnButton(event: MouseEvent) {
		destroyActionMenuIfPossible();
		if (event.button === 0) {
			if (selectedNode) {
				isMouseWithinNodeBoundaries = computeCollisionForNode(selectedNode, {
					x: event.clientX,
					y: event.clientY
				});
			}
			isRightClickDown = false;
			isLeftClickDown = true;
			editorMode = maybeElectrodeWithinBoundaries && isLeftClickDown ? 'arrow' : 'normal';
		} else if (event.button === 2) {
			menuCoordinates = { x: event.clientX, y: event.clientY };
			isLeftClickDown = false;
			drawActionMenuAroundMouse();
		}
	}

	function resetClicks() {
		isLeftClickDown = false;
		isRightClickDown = false;
		editorMode = 'normal';
		if (flowArrowBuffer?.state === 'detached') flowArrowBuffer = undefined;
		destroyActionMenuIfPossible();
		drawLoop();
	}

	function attachArrowToNode(event: MouseEvent) {
		if (!flowArrowBuffer) {
			return;
		}

		for (let node of canvasNodes) {
			const maybeToAttachTo = match({
				anodeCollision: computeCollisionForElectrode(
					node,
					{
						x: event.clientX,
						y: event.clientY
					},
					'anode'
				),
				cathodeCollision: computeCollisionForElectrode(
					node,
					{
						x: event.clientX,
						y: event.clientY
					},
					'cathode'
				)
			})
				.with({ anodeCollision: true }, () => ({ node: node, electrode: 'anode' as const }))
				.with({ cathodeCollision: true }, () => ({
					node: node,
					electrode: 'cathode' as const
				}))
				.otherwise(() => undefined);

			if (maybeToAttachTo) {
				const newFlowArrow = match({
					maybeToAttachTo,
					flowArrowBuffer
				})
					.with(
						{
							maybeToAttachTo: { electrode: 'anode' },
							flowArrowBuffer: { arrow: { from: { electrode: 'cathode' } } }
						},
						() => ({
							to: maybeToAttachTo.node satisfies CanvasNode,
							from: flowArrowBuffer!.arrow.from.node satisfies CanvasNode
						})
					)
					.with(
						{
							maybeToAttachTo: { electrode: 'cathode' },
							flowArrowBuffer: { arrow: { from: { electrode: 'anode' } } }
						},
						() => ({
							to: flowArrowBuffer!.arrow.from.node satisfies CanvasNode,
							from: maybeToAttachTo.node satisfies CanvasNode
						})
					)
					.run();
				onFlowArrowAttached(newFlowArrow.from, newFlowArrow.to);
				break;
			}
		}

		resetClicks();
	}

	function drawActionMenuAroundMouse() {
		actionMenuMounted = mount(ActionMenu, {
			target: document.body,
			props: {
				style: `top:${menuCoordinates.y - MENU_HEIGHT / 2}px;left:${menuCoordinates.x - MENU_WIDTH / 2}px;z-index=40`,
				onExtractClick: () => addNodeToContext('extract'),
				onTransformClick: () => addNodeToContext('transform'),
				onLoadClick: () => addNodeToContext('load')
			}
		});
	}

	function destroyActionMenuIfPossible() {
		if (actionMenuMounted) {
			unmount(actionMenuMounted);
			actionMenuMounted = undefined;
		}
	}

	function selectElementIfPossible(event: MouseEvent) {
		if (event.button === 0) {
			const collidingNode = getCollidedNodeIdWithCoordinates({
				x: event.clientX,
				y: event.clientY
			});
			onNodeSelected(collidingNode);
			drawLoop();
		}
	}

	function getCollidedNodeIdWithCoordinates(coordinates: Coordinates): CanvasNode | undefined {
		for (let node of canvasNodes) {
			const isColliding = computeCollisionForNode(node, coordinates);
			if (isColliding) {
				return node;
			}
		}
		return undefined;
	}

	function computeCollisionForNode(node: CanvasNode, coordinates: Coordinates): boolean {
		const topRight = toGlobalCoordinates(node.coordinates);
		const topLeft = toGlobalCoordinates({
			x: node.coordinates.x,
			y: node.coordinates.y + NODE_DIMENSION
		});
		const bottomRight = toGlobalCoordinates({
			x: node.coordinates.x + NODE_DIMENSION,
			y: node.coordinates.y
		});
		const xCollision = coordinates.x - topRight.x > 0 && bottomRight.x - coordinates.x > 0;
		const yCollision = coordinates.y - topRight.y > 0 && topLeft.y - coordinates.y > 0;
		if (xCollision && yCollision) {
			return true;
		}
		return false;
	}

	function computeCollisionForElectrode(
		node: CanvasNode,
		coordinates: Coordinates,
		electrode: 'anode' | 'cathode'
	): boolean {
		const center = match(electrode)
			.with('anode', () =>
				toGlobalCoordinates({
					x: node.coordinates.x - 5,
					y: node.coordinates.y + NODE_DIMENSION / 2
				})
			)
			.with('cathode', () =>
				toGlobalCoordinates({
					x: node.coordinates.x + NODE_DIMENSION + 5,
					y: node.coordinates.y + NODE_DIMENSION / 2
				})
			)
			.exhaustive();

		return (
			Math.pow(coordinates.x - center.x, 2) + Math.pow(coordinates.y - center.y, 2) <
			Math.pow(ELECTRODE_RADIUS + 3, 2)
		);
	}

	$effect(() => {
		cursor = match({
			maybeElectrodeWithinBoundaries,
			isLeftClickDown,
			editorMode
		})
			.with({ editorMode: 'arrow' }, () => 'cursor-pointer')
			.with({ maybeElectrodeWithinBoundaries: P.nonNullable }, () => 'cursor-pointer')
			.with({ isLeftClickDown: true }, () => 'cursor-grabbing')
			.otherwise(() => 'cursor-grab');
	});
</script>

<canvas
	id="canvas"
	class={`top-0 absolute ${cursor}`}
	{width}
	{height}
	bind:this={canvas}
	onmousedown={updateMouseStateDependingOnButton}
	onmouseup={editorMode === 'arrow' ? attachArrowToNode : resetClicks}
	onmousemove={move}
	onclick={selectElementIfPossible}
	oncontextmenu={(event) => event.preventDefault()}
></canvas>

<div class="absolute flex bottom-10 right-10">
	<Button onClick={zoomIn} type="normal" position="left">+</Button>
	<div
		class="h-10 w-12 flex justify-center items-center bg-white border-gray-300 border-t border-b"
	>
		x{zoomLevel.toFixed(1)}
	</div>
	<Button onClick={zoomOut} type="normal" position="right">-</Button>
</div>
