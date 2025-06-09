import { buildSchema } from 'graphql';

const schema = buildSchema(`
    type Menu {
        name: String!
        menuData: String!
    }
    type GeneralSettingsData {
        site_title: String!
        site_tagline: String
        site_address: String!
        admin_email: String!
    }

    type WritingSettingsData {
        default_post_category: Int
    }

    type ReadingSettingsData {
        show_at_most: Int!
        search_engine_visibility: Boolean
    }

    type EmailSettingsData {
        data: String!
    }

    type DashboardData {
        version: String!
        posts: Int
        pages: Int
    }
    
    type Themes {
        themes: [Theme]
    }

    type Theme {
        id: Int!
        name: String!
        location: String!
    }

    type MediaSettings {
        settings: String
    }

    type Categories {
        categories: [Category]
    }

    type Tags {
        tags: [Category]
    }

    type Category {
        term_id: Int
        name: String
        slug: String
        description: String
        post_count: Int
    }

    type NavPages {
        pages: [NavPost]
        total: Int
    }

    type NavPosts {
        posts: [NavPost]
        total: Int
    }

    type NavPost {
        id: Int
        post_name: String
        post_type: String
        child_count: Int
    }

    type Posts {
        posts: [Post]
        total: Int
    }

    type Pages {
        pages: [Post]
        total: Int
    }

    type Post {
        id: Int!
        post_date: String!
        post_date_gmt: String!
        post_content: String!
        post_title: String!
        post_excerpt: String
        post_status: String!
        post_password: String
        post_name: String
        post_modified: String
        post_modified_gmt: String
        post_parent: Int
        guid: String
        menu_order: Int
        post_type: String
        post_mime_type: String
        comment_count: Int
        post_author: Int
        author: User
        featured_image_id: Int
        featured_image_metadata: String
        template_id: Int
        categories: [Category]
    }

    type PageTemplates {
        templates: [PageTemplate]
        total: Int
    }

    type PageTemplate {
        id: Int!
        name: String!
        file_name: String!
    }

    type Files {
        files: [File]
        total: Int
    }

    type File {
        id: Int
        filename: String!
        mimetype: String!
        encoding: String
        url: String!
        date: String
        author: User
        attachment_metadata: String
    }

    type UserRoles {
        roles: [UserRole]!
    }

    type UserRole {
        id: Int!
        role: String!
    }

    type Users{
        users: [User]
        total: Int
    }

    type User {
        id: Int
        user_login: String
        user_nicename: String
        user_email: String
        user_url: String
        user_registered: String
        user_activation_key: String
        user_status: String
        display_name: String
        first_name: String
        last_name: String
        user_role: UserRole
        post_count: Int
    }
        
    type AuthData {
        token: String!
        refreshToken: String!
        userId: String!
        user: [User]
    }

    type SuccessData {
        success: Boolean!
        error: String
        post_id: Int
    }

    input SystemCreateInput {
        email: String!
        first_name: String!
        last_name: String!
        display_name: String!
        password: String!
    }

    type RootQuery {
        login(email: String!, password: String!): AuthData!
        refresh(refreshToken: String!): AuthData!
        systemCheck: SuccessData!
        getSiteTitle: String
        getGeneralSettings: GeneralSettingsData!
        getWritingSettings: WritingSettingsData!
        getReadingSettings: ReadingSettingsData!
        getEmailSettings: EmailSettingsData!
        getDashboardAtAGlanceData: DashboardData!
        getThemes: Themes!
        getTheme: Theme!
        getMenus: String
        getMenuByName(name: String!): Menu!

        getMediaFiles(folder: String, offset: Int!, type: String, search: String): Files 
        getMediaFileById(id: Int): File
        getMediaSettings: MediaSettings!

        getPostsAndPagesNavigation: NavPosts!
        getPosts(page: Int!, perPage: Int!, type: String!, include_trash: Int!): Posts!
        getPostsByType(page: Int!, perPage: Int!, type: String!): Posts!
        getPostsByStatus(page: Int!, perPage: Int!, type: String!, status: String!): Posts!
        getPostsByAuthor(page: Int!, perPage: Int!, type: String!, author_id: Int!): Posts!
        getPostsByCategory(page: Int!, perPage: Int!, term_id: Int!): Posts!
        getPostBy(field: String!, value: String!): Post
        getCategory(slug: String!): Category
        getPostCategories(postId: Int!): Categories
        getPostTags(postId: Int!): Tags

        getPagesAndPagesNavigation: NavPages!
        getPages(page: Int!, perPage: Int!, type: String!, include_trash: Int!): Pages!
        getPagesByStatus(page: Int!, perPage: Int!, type: String!, status: String!): Pages!
        getPagesByAuthor(page: Int!, perPage: Int!, type: String!, author_id: Int!): Pages!
        getPageBy(field: String!, value: String!): Post
        getPageTemplates(page: Int!, perPage: Int!): PageTemplates
        getPageTemplatesAll: PageTemplates
        getPageTemplate(slug: String!): PageTemplate!

        getCategories(type: String!): Categories!
        getTags(type: String!): Tags!

        getUserRoles: UserRoles
        getUsers(page: Int!, perPage: Int!): Users!
        getUserBy(field: String!, value: String!): User
        getAuthors: Users!
        getAuthor(id: Int!): User!
    }

    type RootMutation {
        systemCreate(input: SystemCreateInput!): SuccessData!
        updateGeneralSettings(site_title: String!, site_tagline: String, site_address: String!, admin_email: String!): SuccessData!
        updateWritingSettings(default_posts_category: Int): SuccessData!
        updateReadingSettings(show_at_most: Int!, search_engine_visibility: Boolean!): SuccessData!
        addTheme(name: String!, location: String!): SuccessData!
        deleteTheme(id: Int!): SuccessData!
        setActiveTheme(id: Int!): SuccessData!
        updateTheme(id: Int!, name: String!, location: String!): SuccessData!
        updateMenus(menus: String!): SuccessData!
        updateEmailSettings(data: String!): SuccessData!
        sendTestEmail(toAddress: String!): SuccessData!

        deleteFiles(ids: [Int]!): SuccessData!
        updateMediaSettings(data: String!): SuccessData!
        
        createDraftNewPost(title: String, content: String, featuredImageId: Int, categories: String, tags: String): SuccessData!
        createPublishNewPost(title: String, content: String, featuredImageId: Int, categories: String, tags: String): SuccessData!
        updatePost(title: String, content: String, featuredImageId: Int, postId: Int!): SuccessData!
        updatePostStatus(status: String!, post_id: Int!): SuccessData!
        updatePostPublishDate(date: String!, post_id: Int!): SuccessData!
        updatePostPassword(password: String!, post_id: Int!): SuccessData!
        updatePostCategories(categories: String!, postId: Int!): SuccessData!
        updatePostTags(tags: String!, postId: Int!): SuccessData!

        createDraftNewPage(title: String, content: String, featuredImageId: Int, categories: String, tags: String): SuccessData!
        createPublishNewPage(title: String, content: String, featuredImageId: Int, categories: String, tags: String): SuccessData!
        updatePage(title: String, content: String, featuredImageId: Int, postId: Int!): SuccessData!
        updatePageStatus(status: String!, post_id: Int!): SuccessData!
        updatePagePublishDate(date: String!, post_id: Int!): SuccessData!
        updatePagePassword(password: String!, post_id: Int!): SuccessData!
        updatePageCategories(categories: String!, postId: Int!): SuccessData!
        updatePageTags(tags: String!, postId: Int!): SuccessData!
        
        createPostCategory(name: String!, slug: String!, description: String): SuccessData!
        updatePostCategory(name: String!, slug: String!, description: String, categoryId: Int!): SuccessData!
        deletePostCategory(id: Int!): SuccessData!
        createPostTag(name: String!, slug: String!, description: String): SuccessData!
        updatePostTag(name: String!, slug: String!, description: String, tagId: Int!): SuccessData!
        deletePostTag(id: Int!): SuccessData!

        createPageCategory(name: String!, slug: String!, description: String): SuccessData!
        updatePageCategory(name: String!, slug: String!, description: String, categoryId: Int!): SuccessData!
        deletePageCategory(id: Int!): SuccessData!
        createPageTag(name: String!, slug: String!, description: String): SuccessData!
        updatePageTag(name: String!, slug: String!, description: String, tagId: Int!): SuccessData!
        deletePageTag(id: Int!): SuccessData!

        createPageTemplate(name: String!, filename: String!): SuccessData!
        updatePageTemplate(name: String!, filename: String!, templateId: Int!): SuccessData! 
        updatePageTemplateId(templateId: Int!, postId: Int!): SuccessData!
        
        updateUser(user_nicename: String, first_name: String, last_name: String, user_email: String, user_password: String, roleId: Int, userId: Int): SuccessData!
        createUser(display_name: String!, first_name: String!, last_name: String!, user_email: String!, user_password: String!, roleId: Int!): SuccessData!
        createNewPassword(password: String!, userLogin: String!, key: String!): SuccessData!
        passwordResetAdmin(userId: Int): SuccessData!
        
    }

    schema {
        query: RootQuery,
        mutation: RootMutation
    } 
`);

export default schema;
