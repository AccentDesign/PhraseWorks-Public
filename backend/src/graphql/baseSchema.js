const baseTypeDefs = `
    scalar Upload

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
        comments: Int
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

    type PostMeta {
        meta_id: Int
        meta_key: String
        meta_value: String
    }

    type Term {
        term_id: Int
        name: String
        slug: String
        taxonomy: String
        description: String
        parent: Int
        count: Int
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
        post_date: String
        post_date_gmt: String
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
        featured_image_imagedata: String
        template_id: Int
        categories: [Category]
        comment_status: String
        ping_status: String
        to_ping: String
        pinged: String
        post_content_filtered: String
        meta: [PostMeta]
        terms: [Term]
        comments: [Comment]
    }

    type PWQueryResult {
        posts: [Post]
        total: Int
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
        url: String
        date: String
        author: User
        attachment_metadata: String
        metadata: String
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
        refreshTokenExpiry: Int!
        userId: String!
        user: [User]
    }

    type SuccessData {
        success: Boolean!
        error: String
        post_id: Int
    }

    type CacheStats {
        connected: Boolean!
        totalKeys: Int!
        memoryInfo: String
        keyspaceInfo: String
        timestamp: Float!
    }

    type CacheOperationResult {
        success: Boolean!
        message: String!
        deletedCount: Int
    }

    type Job {
        id: Int!
        job_type: String!
        payload: String!
        status: String!
        attempts: Int!
        error_message: String
        created_at: String!
        completed_at: String
    }

    type JobStats {
        status: String!
        count: Int!
        avg_duration: Float
    }

    type Plugin {
        logo: String!
        data: String!
        file: String!
    }

    type PluginsRepo {
        plugins: [Plugin]
    }

    type Fields {
        fields: [Field]
    }

    type Field {
        name: String!
        title: String!
        order: Int
    }

    type Comment {
        comment_id: Int!
        comment_post_id: Int!
        comment_author: Int!
        comment_author_email: String
        comment_author_url: String
        comment_author_ip: String
        comment_date: String
        comment_date_gmt: String
        comment_content: String
        comment_approved: Boolean
        comment_parent: Int
        comment_author_name: String
        user_id: Int
        user: User
        post: Post
        user_role: Int
    }

    type Comments {
        comments: [Comment]
        totalComments: Int
    }

    input SystemCreateInput {
        email: String!
        first_name: String!
        last_name: String!
        display_name: String!
        password: String!
    }

    input UserInput {
        email: String!
        first_name: String!
        last_name: String!
        display_name: String!
        password: String!
    }

    type Query {
        login(email: String!, password: String!): AuthData!
        refresh(refreshToken: String!, userId: Int): AuthData!
        systemCheck: SuccessData!
        getSiteTitle: String
        getGeneralSettings: GeneralSettingsData!
        getWritingSettings: WritingSettingsData!
        getReadingSettings: ReadingSettingsData!
        getEmailSettings: EmailSettingsData!
        getDashboardAtAGlanceData: DashboardData!
        getDashboardActivityData: Posts!
        getThemes: Themes!
        getTheme: Theme!
        getMenus: String
        getAdminMenus: String!
        getAdminPages: String!
        getMenuByName(name: String!): Menu!
        getCronTasks: String!

        getCustomFieldGroups: String!
        getCustomFieldGroupById(groupId: String!): String!
        getCustomFieldGroupsWhereMatch(type: String!, equal: String!, target: String!): String!
        getPostCustomFieldData(postId: Int): String!
        getField(postId: Int!, name: String!, formatValue: Boolean, escapeHtml: Boolean): String!
        getFields(postId: Int!): String!

        getCustomPosts: String!
        getCustomPostById(postId: String!): String!
        getCustomPostsWhereMatch(type: String!, equal: String!, target: String!): String!
        getCustomPostBySlug(slug: String!): String!

        getMediaFiles(folder: String, offset: Int!, type: String, search: String): Files 
        getMediaFileById(id: Int): File
        getMediaSettings: MediaSettings!
        getMediaItemData(fileId: Int): String!

        getPostsAndPagesNavigation: NavPosts!
        getPostTypes: [String!]!
        getPosts(page: Int!, perPage: Int!, type: String!, include_trash: Int!): Posts!
        getPostsSearch(search: String!, page: Int!, perPage: Int!, type: String!): Posts! 
        getPostsByType(page: Int!, perPage: Int!, type: String!): Posts!
        getPostsByStatus(page: Int!, perPage: Int!, type: String!, status: String!): Posts!
        getPostsByAuthor(page: Int!, perPage: Int!, type: String!, author_id: Int!): Posts!
        getPostsByCategory(page: Int!, perPage: Int!, term_id: Int!): Posts!
        getPostBy(field: String!, value: String!): Post
        getCategory(slug: String!): Category
        getPostCategories(postId: Int!): Categories
        getPostTags(postId: Int!): Tags
        getPostSEO(postId: Int!): String
        getPostTableFields(postType: String!): Fields!

        getPostComments(postId: Int!): Comments!
        getAllAdminComments(page: Int!, perPage: Int!): Comments!
        getAllAdminCommentsByAuthor(page: Int!, perPage: Int!, userId: Int!): Comments!

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

        getPlugins: String
        getPluginPageComponents(pageKey: String!): String

        getSiteSEOSettings: String
        getShortcodes: String

        getPluginsRepo: PluginsRepo!
        getPWQuery(args: String!): PWQueryResult!
        getCacheStats: CacheStats
        getJobs(limit: Int): [Job!]!
        getJobStats: [JobStats!]!
    }

    type Mutation {
        systemCreate(input: SystemCreateInput!): SuccessData!
        userCreate(input: UserInput!): SuccessData!
        forgottenPassword(email: String!): SuccessData!
        resetPassword(token: String!, password: String!): SuccessData!
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
        runCronTaskInstantly(id: Int!): SuccessData!

        regeneratePlugins(regenerate: Boolean!): SuccessData!

        updateCustomFieldGroups(groups: String!): SuccessData!
        updateCustomFieldGroupsStatus(id: String!, status: String!): SuccessData!
        updatePostCustomFieldData(data: String!, postId: Int!): SuccessData!

        updateCustomPosts(posts: String!): SuccessData!
        updateCustomPostStatus(id: String!, status: String!): SuccessData!

        uploadFile(file: Upload): SuccessData!
        replaceFile(id: Int!, file: Upload): SuccessData!
        replaceFileWithSetting(id: Int!, file: Upload, setting: String!): SuccessData!
        deleteFile(filepath: String): SuccessData!
        deleteFiles(ids: [String]!): SuccessData!
        updateMediaSettings(data: String!): SuccessData!
        updateMediaItemData(fileId: Int!, data: String!): SuccessData!
        
        createDraftNewPost(title: String, content: String, featuredImageId: Int, categories: String, tags: String, postType: String): SuccessData!
        createScheduledNewPost(title: String, content: String, featuredImageId: Int, categories: String, tags: String, postType: String, publishDate: String): SuccessData!
        createPublishNewPost(title: String, content: String, featuredImageId: Int, categories: String, tags: String, postType: String): SuccessData!
        updatePost(title: String, content: String, featuredImageId: Int, postId: Int!): SuccessData!
        updatePostStatus(status: String!, post_id: Int!): SuccessData!
        updatePostPublishDate(date: String!, post_id: Int!): SuccessData!
        updatePostPassword(password: String!, post_id: Int!): SuccessData!
        updatePostCategories(categories: String!, postId: Int!): SuccessData!
        updatePostTags(tags: String!, postId: Int!): SuccessData!
        updatePostSEO(seo: String!, postId: Int!): SuccessData!

        deletePost(postId: Int!): SuccessData!

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

        addNewPostComment(postId: Int!, comment: String!): SuccessData!
        deleteCommentById(id: Int!): SuccessData!

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

        deleteUser(userId: Int!): SuccessData!

        updatePlugins(plugins: String!): SuccessData!
        installPlugin(pluginUrl: String!): SuccessData!

        updateSiteSEOSettings(seoSettings: String!): SuccessData!

        logError(error: String!, logType: String!): SuccessData!
        clearCache(type: String! = "all", tags: [String!] = []): CacheOperationResult!
        warmupCache: CacheOperationResult!
        addEmailJob(to: String!, subject: String!, html: String!, text: String): SuccessData!
        retryJob(id: Int!): SuccessData!
    }

    schema {
        query: Query,
        mutation: Mutation
    } 
`;

export default baseTypeDefs;
