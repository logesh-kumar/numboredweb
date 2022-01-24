import logout from "app/auth/mutations/logout"
import React from "react"
import { useMutation } from "blitz"
import { MdLogout } from "react-icons/md"

export const Logout: React.FC = ({}) => {
  const [logoutMutation] = useMutation(logout)
  return <MdLogout onClick={() => logoutMutation()} />
}
