import React, { useState } from "react"
import { MdOutlineLeaderboard } from "react-icons/md"
import { useQuery } from "blitz"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import getGames from "../queries/getGames"

export const Leaderboard: React.FC = () => {
  const user = useCurrentUser()
  const [games, { isFetching, refetch }] = useQuery(
    getGames,
    { where: { userId: user?.id } },
    { enabled: false }
  )
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={async () => {
          await refetch()
          setShowModal(true)
        }}
      >
        <MdOutlineLeaderboard className="w-8" />
      </button>

      {showModal && (
        <div
          className="modal fade fixed top-0 left-0  w-full h-full outline-none overflow-x-hidden overflow-y-auto"
          id="exampleModalFullscreen"
          tabIndex={-1}
          aria-labelledby="exampleModalFullscreenLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-fullscreen relative w-auto pointer-events-none">
            <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
              <div className="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
                <h5
                  className="text-xl font-medium leading-normal text-gray-800"
                  id="exampleModalFullscreenLabel"
                >
                  Leaderboard
                </h5>
                <button
                  type="button"
                  className="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body relative p-4">
                <table className="min-w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="text-sm text-center  font-medium text-gray-900 px-6 py-4 text-left">
                        Name
                      </th>
                      <th className="text-sm text-center font-medium text-gray-900 px-6 py-4 text-left">
                        Duration
                      </th>
                      <th className="text-sm text-center font-medium text-gray-900 px-6 py-4 text-left">
                        Attempt
                      </th>
                    </tr>
                  </thead>
                  <tbody className="w-full">
                    {games?.games.map(({ id, attempt, user, duration }) => (
                      <tr className="border-b" key={id}>
                        <td className="text-center">{user.name}</td>
                        <td className="text-center">{duration?.toFixed(2)}</td>
                        <td className="text-center">
                          {attempt} {attempt === 1 ? "st" : "rd"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md">
                <button
                  onClick={() => setShowModal(false)}
                  type="button"
                  className="inline-block px-6 py-2.5 bg-gray-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-gray-700 hover:shadow-lg focus:bg-gray-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-800 active:shadow-lg transition duration-150 ease-in-out"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
