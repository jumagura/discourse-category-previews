import Component from "@ember/component";
import { equal } from "@ember/object/computed";
import discourseComputed from "discourse-common/utils/decorators";

const allCategoryPreviews = settings.categories ? JSON.parse(settings.categories) : [];

export default Component.extend({
  noCategoryStyle: equal("siteSettings.category_style", "none"),
  boxStyle: equal("siteSettings.desktop_category_page_style", "categories_boxes"),

  @discourseComputed()
  preview() {
    const previewData = [];
    const loggedInUser = this.currentUser;
    const loggedInUserGroup = loggedInUser ? loggedInUser.groups.map((g) => g.name) : [];
    const isStaff = loggedInUser ? loggedInUser.staff : false;
    const categorySlug = this.args.category.slug;

    allCategoryPreviews.forEach((data) => {
      const permittedGroup = data.special_groups ? data.special_groups.split(",") : [];
      const hasCategoryAccess = loggedInUserGroup.some((g) => permittedGroup.indexOf(g) > -1);
      const shouldRender = !loggedInUser || isStaff || !hasCategoryAccess;
      if (shouldRender && categorySlug === data.category_slug) {
        previewData.push({
          icon: data.icon,
          title: data.title,
          description: data.description,
          href: data.url,
          className: `above-${categorySlug}`,
          color: settings.border_color,
        });
      }
    });
    return previewData;
  },
});
