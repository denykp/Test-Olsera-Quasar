const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "login",
      },
      {
        path: "liked-posts",
        component: () => import("pages/LikedPosts.vue"),
      },
      {
        path: "",
        component: () => import("pages/IndexPage.vue"),
        children: [
          {
            path: "posts/:postId",
            component: () => import("pages/IndexPage.vue"),
          },
        ],
      },
      {
        path: "admin",
        component: () => import("pages/AdminPage.vue"),
        meta: {
          requireAuth: true,
        },
        children: [
          {
            path: "create",
          },
          {
            path: "posts",
            children: [
              {
                path: ":postId",
              },
              {
                path: ":postId/:edit",
              },
            ],
          },
        ],
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
