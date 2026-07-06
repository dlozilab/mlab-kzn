// server/pages/cms/list.js
// Shared list page — Template Method pattern
// Used by ALL standard entities — journeys, media, reports, users etc.
// Receives a feature config and items array, returns a complete HTML page

const { cmsPage }        = require('../../components/layout')
const { PageHeader, AddButton } = require('../../components/page-header')
const { SearchBar }      = require('../../components/form-elements')
const { CardList }       = require('../../components/card')

function ListPage({ feature, items, user, searchQuery = '' }) {
  const main = `
    ${PageHeader({
      title:  feature.label,
      sub:    feature.sub || '',
      action: feature.ops.includes('c') && !feature.readOnly
                ? AddButton(feature)
                : '',
    })}

    <form method="GET" action="/cms/${feature.id}">
      ${SearchBar({
        placeholder: `Search ${feature.label.toLowerCase()}...`,
        value: searchQuery,
      })}
    </form>

    ${CardList(items, feature)}
  `

  return cmsPage({
    title:         feature.label,
    activeFeature: feature.id,
    user,
    main,
  })
}

module.exports = { ListPage }
