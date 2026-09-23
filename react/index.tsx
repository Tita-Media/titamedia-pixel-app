import { canUseDOM } from 'vtex.render-runtime'

console.log('[titamedia-pixel] MODULE LOADED')

interface PixelSettings {
  convertScript?: string
}

let hasInjected = false

function injectScript(rawHtml: string) {
  if (hasInjected) {
    return
  }

  hasInjected = true

  const template = document.createElement('template')

  template.innerHTML = rawHtml

  document.head.appendChild(
    document.createComment('pixel:start:titamedia.titamedia-pixel')
  )

  template.content.childNodes.forEach((node) => {
    if (node.nodeName === 'SCRIPT') {
      const original = node as HTMLScriptElement
      const script = document.createElement('script')

      Array.from(original.attributes).forEach((attr) => {
        script.setAttribute(attr.name, attr.value)
      })
      script.text = original.text

      document.head.appendChild(script)
    } else {
      document.head.appendChild(node.cloneNode(true))
    }
  })

  document.head.appendChild(
    document.createComment('pixel:end:titamedia.titamedia-pixel')
  )
}

const APP_SETTINGS_QUERY = `
  query AppSettings($version: String) {
    publicSettingsForApp(app: "titamedia.titamedia-pixel", version: $version)
      @context(provider: "vtex.apps-graphql") {
      message
    }
  }
`

function loadAndInjectScript() {
  console.log('[titamedia-pixel] fetching settings via GraphQL...')

  fetch('/_v/public/graphql/v1', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query: APP_SETTINGS_QUERY,
      variables: { version: process.env.VTEX_APP_VERSION },
    }),
  })
    .then((response) => response.json())
    .then((json) => {
      console.log('[titamedia-pixel] graphql response', json)

      const message = json?.data?.publicSettingsForApp?.message

      if (!message) {
        console.log('[titamedia-pixel] no settings message found')
        return
      }

      const { convertScript }: PixelSettings = JSON.parse(message)

      console.log('[titamedia-pixel] parsed convertScript =', convertScript)

      if (convertScript) {
        injectScript(convertScript)
        console.log('[titamedia-pixel] injectScript called')
      }
    })
    .catch((error) => {
      console.error('[titamedia-pixel] failed to fetch settings', error)
    })
}

if (canUseDOM) {
  loadAndInjectScript()
}

// no-op for extension point
export default function TitaMediaPixel() {
  return null
}
