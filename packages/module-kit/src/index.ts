/**
 * Module contract.
 *
 * A business capability is a folder under `modules/`, not a branch in the app.
 * The console builds its navigation, its dashboard and the RBAC permission
 * catalogue from this registry, so adding a capability is one folder plus one
 * registry line — never a refactor of the core.
 */

export type ModuleStatus = "active" | "planned";

export interface ModuleNavItem {
  label: string;
  href: string;
  /** Permission key required to see and use this entry. */
  permission: string;
  icon?: string;
}

export interface ModulePermission {
  key: string;
  label: string;
}

export interface ModuleJob {
  /** Queue name. Unique across all modules. */
  name: string;
  description: string;
  /** Cron expression for scheduled jobs; omitted for event-driven ones. */
  schedule?: string;
}

export interface ApexModule {
  id: string;
  name: string;
  description: string;
  status: ModuleStatus;
  nav: ModuleNavItem[];
  permissions: ModulePermission[];
  jobs: ModuleJob[];
  /** Module ids this one requires. Every module depends on `core`. */
  dependsOn: string[];
}

export interface DefineModuleInput extends Omit<ApexModule, "nav" | "permissions" | "jobs" | "dependsOn"> {
  nav?: ModuleNavItem[];
  permissions?: ModulePermission[];
  jobs?: ModuleJob[];
  dependsOn?: string[];
}

export function defineModule(input: DefineModuleInput): ApexModule {
  const module: ApexModule = {
    ...input,
    nav: input.nav ?? [],
    permissions: input.permissions ?? [],
    jobs: input.jobs ?? [],
    dependsOn: input.dependsOn ?? [],
  };

  // A planned module that contributed navigation would put a live link to an
  // unbuilt page in the console. Caught here rather than by a 404 in
  // production.
  if (module.status === "planned" && module.nav.length > 0) {
    throw new Error(
      `Module "${module.id}" is planned but declares navigation. ` +
        `Set status to "active" or remove the nav entries.`,
    );
  }

  // Every nav entry must be gated by a permission the module actually owns,
  // otherwise the RBAC catalogue and the UI drift apart silently.
  const owned = new Set(module.permissions.map((p) => p.key));
  for (const item of module.nav) {
    if (!owned.has(item.permission)) {
      throw new Error(
        `Module "${module.id}" nav item "${item.label}" requires permission ` +
          `"${item.permission}", which the module does not declare.`,
      );
    }
  }

  // Permission keys are namespaced by module so two modules cannot collide.
  for (const permission of module.permissions) {
    if (!permission.key.includes(":")) {
      throw new Error(
        `Permission "${permission.key}" in module "${module.id}" must be namespaced, e.g. "${module.id}:read".`,
      );
    }
  }

  return module;
}

/** Navigation for a user, in registry order, filtered by what they may do. */
export function navigationFor(modules: ApexModule[], permissions: string[]): ModuleNavItem[] {
  const held = new Set(permissions);
  return modules
    .filter((m) => m.status === "active")
    .flatMap((m) => m.nav)
    .filter((item) => held.has(item.permission));
}

/** The full permission catalogue, for reconciling into the database on boot. */
export function permissionCatalogue(
  modules: ApexModule[],
): Array<{ moduleId: string; key: string; label: string }> {
  return modules.flatMap((m) =>
    m.permissions.map((p) => ({ moduleId: m.id, key: p.key, label: p.label })),
  );
}

/** Fails fast on a dependency that is missing or not yet built. */
export function assertDependencies(modules: ApexModule[]): void {
  const byId = new Map(modules.map((m) => [m.id, m]));

  for (const module of modules) {
    for (const dependency of module.dependsOn) {
      const target = byId.get(dependency);
      if (!target) {
        throw new Error(`Module "${module.id}" depends on unknown module "${dependency}".`);
      }
      if (module.status === "active" && target.status === "planned") {
        throw new Error(
          `Module "${module.id}" is active but depends on "${dependency}", which is only planned.`,
        );
      }
    }
  }
}
