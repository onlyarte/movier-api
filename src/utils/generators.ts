export const makeObjectResolvers = (model: string, fields: string[]) => {
  return fields.reduce((resolvers, field) => {
    resolvers[field] = async (
      parent: any,
      args: any,
      context: any,
      info: any
    ) => {
      return (
        parent[field] ??
        (await context.prisma[model]
          .findUnique({ where: { id: parent.id } })
          [field]())!
      );
    };
    return resolvers;
  }, {} as Record<string, Function>);
};
