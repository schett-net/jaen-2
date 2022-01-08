import deepmerge from 'deepmerge'
import {graphql, useStaticQuery} from 'gatsby'
import * as React from 'react'

import {
  RootState,
  store,
  useAppDeepEqualSelector,
  useAppSelector
} from '../../../store'
import {JaenPage, TreeNode} from '../../types'

export {TreeNode}

type QueryData = {
  allJaenPage: {
    nodes: TreeNode[]
  }
}

const useStaticData = () => {
  let staticData: QueryData

  try {
    staticData = useStaticQuery<QueryData>(graphql`
      query {
        allJaenPage(filter: {id: {ne: "JaenPage /"}}) {
          nodes {
            id
            slug
            parent {
              id
            }
            children {
              id
            }
            jaenPageMetadata {
              title
              isBlogPost
              image
              description
              datePublished
              canonical
            }
            template {
              name
              displayName
            }
          }
        }
      }
    `)
  } catch (e) {
    staticData = {
      allJaenPage: {
        nodes: []
      }
    }
  }

  return staticData
}

const getStatePages = (state: RootState) =>
  Object.keys(state.pages.pages).map(id => {
    const {slug, parent, children, jaenPageMetadata, template, deleted} =
      state.pages.pages[id]

    return {
      id,
      ...(slug && {slug}),
      ...(parent !== undefined && {parent}),
      ...(children && {children}),
      ...(jaenPageMetadata && {jaenPageMetadata}),
      ...(template && {template}),
      ...(deleted && {deleted})
    }
  })

const mergeStaticWithStatePages = (
  staticPages: TreeNode[],
  statePages: JaenPage[]
): TreeNode[] =>
  staticPages
    .concat(
      statePages.filter(
        item => staticPages.findIndex(n => n.id === item.id) === -1
      )
    )
    .map(({id}) => {
      const p1 = staticPages.find(e => e.id === id)
      const p2 = statePages.find(e => e.id === id)

      return deepmerge(p1 || {}, p2 || {})
    })

/**
 * Access the PageTree of the JaenContext and Static.
 */
export const useJaenPageTree = (): TreeNode[] => {
  const staticData = useStaticData()
  const pages = useAppDeepEqualSelector(state =>
    getStatePages(state)
  ) as TreeNode[]

  const mergeData = React.useMemo(
    () => mergeStaticWithStatePages(staticData.allJaenPage.nodes, pages as any),
    [staticData, pages]
  )

  console.log(
    '🚀 ~ file: useJaenPageTree.tsx ~ line 125 ~ mergeData',
    mergeData
  )

  return mergeData

  const [data, setData] = React.useState<TreeNode[]>(mergeData)

  React.useEffect(() => {
    setData(mergeData)
    console.log(
      '🚀 ~ file: useJaenPageTree.tsx ~ line 99 ~ React.useEffect ~ mergeData',
      mergeData
    )
  }, [mergeData])

  return data
}
