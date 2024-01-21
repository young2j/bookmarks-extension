import CountUp from "react-countup"

type StatProps = {
  data: number | string
  description: string
  isNumeric?: Boolean
}

export const ProfileStat = ({ data, description }: StatProps) => {
  return (
    <div className="flex flex-col w-1/3">
      <CountUp
        className="text-2xl font-semibold"
        end={data as number}
        duration={5}
      />
      <span className="text-sm text-zinc-500">{description}</span>
    </div>
  )
}

export const GroupStat = ({
  data,
  description,
  isNumeric = true
}: StatProps) => {
  return (
    <div className="flex flex-row items-center space-x-1 ">
      <span className="text-sm text-zinc-500">{description}:</span>
      {isNumeric ? (
        <CountUp
          className="self-center text-sm font-semibold"
          end={data as number}
          duration={5}
        />
      ) : (
        <span className="self-center text-sm">{data}</span>
      )}
    </div>
  )
}
