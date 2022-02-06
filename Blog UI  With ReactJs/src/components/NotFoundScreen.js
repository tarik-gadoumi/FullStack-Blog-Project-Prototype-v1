/** @jsxRuntime classic */
/** @jsx jsx */
import {jsx} from '@emotion/react'
import {Link} from './lib'


function NotFoundScreen() {
  return (
    <div
      css={{
        height: '100%',
        display: 'grid',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div>
        Sorry... nothing here.
        {/* 🐨 add a <Link> here that says "Go home" and sends the user to "/discover" */}
        <Link to='/discover'>Go home</Link>
      </div>
    </div>
  )
}

export {NotFoundScreen}
