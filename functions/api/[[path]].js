import app from './_app'

export const onRequest = async (context) => {
  const { request, env } = context
  return app.fetch(request, { env, ctx: context })
}
