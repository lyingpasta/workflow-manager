export type Coordinates = {
  x: number,
  y: number
}

export type CanvasNode = {
  id: string,
  coordinates: Coordinates
  title: string,
}

type ExtractProps = {
  type: "extract",
  source: "node" | "job",
  paths: string[]
}

type LoadProps = {
  type: "load",
  path: string
}

export type ExtendedCanvasNode = CanvasNode & (ExtractProps | LoadProps)
