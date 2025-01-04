import { TableCell, TableRow } from "./table"

export function SkeletonTable({ columns }: { columns: number }) {
  return (
    <>
      {[1, 2, 3].map((row) => (
        <TableRow key={row} className="animate-pulse">
          {Array.from({ length: columns }).map((_, i) => (
            <TableCell key={i}>
              <div className="h-4 bg-muted rounded w-[80%]" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}