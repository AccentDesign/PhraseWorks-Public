# PW_Query API Reference

**PW_Query** is PhraseWorks' powerful query system for retrieving posts, pages, and custom content. It provides a flexible interface similar to WordPress's WP_Query but optimized for modern JavaScript applications.

## Overview

The PW_Query class allows you to construct complex database queries using an intuitive parameter-based syntax. It's used extensively throughout PhraseWorks for content retrieval in both frontend themes and admin interfaces.

## Parameters

### Author Parameters

Show posts associated with certain author.

- `author` (int) – use author id.
- `author_name` (string) – use ‘user_nicename‘ – NOT name.

##### Show Posts for one Author

Display posts by author, using author id:

```
const result = await PW_Query({
    author: 1,
});

```

Display posts by author, using author ‘user_nicename‘:

```
const result = await PW_Query({
    author_name: 'Nick',
});
```

#### Show Posts From Multiple Authors

Display posts from several specific authors:

```
const result = await PW_Query({
    author: [1, 17],
});
```

#### Exclude Posts Belonging to an Author

Display all posts except those from an author(singular) by prefixing its id with a ‘-‘ (minus) sign:

```
const result = await PW_Query({
    author: -1,
});
```

#### Exclude Posts Belonging to Multiple Authors

Display all posts except those from an author(singular) by prefixing its id with a ‘-‘ (minus) sign:

```
const result = await PW_Query({
    author: [-1, -17],
});
```

### Category Parameters

Show posts associated with certain categories.

- `cat` (int) – use category id.

#### Display posts that have one category using category id:

```
const result = await PW_Query({
    cat: 8,
});
```

#### Display posts that have multiple categories using category id:

```
const result = await PW_Query({
    cat: [8, 9],
});
```

#### Exclude posts that have one category using category id:

```
const result = await PW_Query({
    cat: -8,
});
```

#### Exclude posts that have multiple categories using category id:

```
const result = await PW_Query({
    cat: [-8, -9],
});
```

### Tag Parameters

Show posts associated with certain categories.

- `tag` (int) – use tag id.

#### Display posts that have one tag using tag id:

```
const result = await PW_Query({
    tag: 7,
});
```

#### Display posts that have multiple tags using tag id:

```
const result = await PW_Query({
    tag: [7, 8],
});
```

#### Exclude posts that have one tag using tag id:

```
const result = await PW_Query({
    tag: -7,
});
```

#### Exclude posts that have multiple tags using tag id:

```
const result = await PW_Query({
    tag: [-7, -8],
});
```

### Taxonomy Parameters

Show posts associated with certain taxonomy.

- `tax_query` (array) – use taxonomy parameters (available since version 3.1).
  - `relation` (string) – The logical relationship between each inner taxonomy array when there is more than one. Possible values are ‘AND’, ‘OR’. Do not use with a single inner taxonomy array.
  - `taxonomy` (string) – Taxonomy.
  - `field` (string) – Select taxonomy term by. Possible values are ‘term_id’, ‘name’, ‘slug’ or ‘term_taxonomy_id’. Default value is ‘term_id’.
  - `terms` (int/string/array) – Taxonomy term(s).
  - `include_children` (boolean) – Whether or not to include children for hierarchical taxonomies. Defaults to true.
  - `operator` (string) – Operator to test. Possible values are ‘IN’, ‘NOT IN’, ‘AND’, ‘EXISTS’ and ‘NOT EXISTS’. Default value is ‘IN’.
    Important Note: tax_query takes an array of tax query arguments arrays (it takes an array of arrays).
    This construct allows you to query multiple taxonomies by using the relation parameter in the first (outer) array to describe the boolean relationship between the taxonomy arrays.

#### Simple Taxonomy Query:

Display posts tagged with bob, under people custom taxonomy:

```
const result = await PW_Query({
    post_type: 'post',
    tax_query: {
        queries: [
            {
                taxonomy: 'people',
                field: 'slug',
                terms: 'bob'
            }
        ]
    }
});
```

#### Multiple Taxonomy Handling:

Display posts from several custom taxonomies:

```
const result = await PW_Query({
    post_type: 'post',
    tax_query: {
        relation: 'AND',
        queries: [
            {
                taxonomy: 'movie_genre',
                field: 'slug',
                terms: ['action', 'comedy']
            },
            {
                taxonomy: 'actor',
                field: 'term_id',
                terms: [103, 115, 206],
                operator: 'NOT IN',
            }
        ]
    }
});
```

Display posts that are in the quotes category OR have the quote post format:

```
const result = await PW_Query({
    post_type: 'post',
    tax_query: {
        relation: 'OR',
        queries: [
            {
                taxonomy: 'category',
                field: 'slug',
                terms: 'quotes'
            },
            {
                taxonomy: 'post_format',
                field: 'slug',
                terms: ['post-format-quote'],
            }
        ]
    }
});
```

#### Nested Taxonomy Handling:

The 'tax_query' clauses can be nested, to create more complex queries. Example: Display posts that are in the quotes category OR both have the quote post format AND are in the wisdom category:

```
const result = await PW_Query({
    post_type: 'post',
    tax_query: {
        relation: 'OR',
        queries: [
            {
                taxonomy: 'category',
                field: 'slug',
                terms: 'quotes'
            },
            {
                relation: 'AND',
                queries: [
                    {
                        taxonomy: 'post_format',
                        field: 'slug',
                        terms: ['post-format-quote'],
                    },
                    {
                        taxonomy: 'category',
                        field: 'slug',
                        terms: ['wisdom'],
                    }
                ]
            }
        ]
    }
});
```

### Search Parameters

Show posts based on a keyword search.

- `s` (string) – Search keyword.
  Show Posts based on a keyword search

```
const result = await PW_Query({
    s: 'keyword',
});
```

Prepending a term with a hyphen will exclude posts matching that term. Eg, 'testing -cathedral' will return posts containing testing but not ‘cathedral’

### Post & Page Parameters

Display content based on post and page parameters. Remember that default post_type is only set to display posts but not pages.

- `p` (int) – use post id.
- `name` (string) – use post slug.
- `page_id` (int) – use page id.
- `pagename` (string) – use page slug.
- `post_parent` (int) – use page id to return only child pages. Set to 0 to return only top-level entries.
- `post_parent__in` (array) – use post ids. Specify posts whose parent is in an array.
- `post_parent__not_in` (array) – use post ids. Specify posts whose parent is not in an array.
- `post__in` (array) – use post ids. Specify posts to retrieve. ATTENTION If you use sticky posts, they will be included (prepended!) in the posts you retrieve whether you want it or not. To suppress this behaviour use ignore_sticky_posts.
- `post__not_in` (array) – use post ids. Specify post NOT to retrieve.
- `post_name__in` (array) – use post slugs. Specify posts to retrieve.
- `title` (string) – use DB field post_title. Must be an exact match. Specify posts to retrieve.

#### Display post by id:

```
const result = await PW_Query({
    p: 117,
});
```

#### Display page by id:

```
const result = await PW_Query({
    page_id: 105,
});
```

#### Show post/page by slug:

```
const result = await PW_Query({
    name: 'test2',
});
```

#### Display page by slug:

```
const result = await PW_Query({
    pagename: 'test4',
});
```

#### Display posts by title:

```
const result = await PW_Query({
    title: 'testing',
});
```

#### Display child page using the slug of the parent and the child page, separated by a slash (e.g. ‘parent_slug/child_slug’):

```
const result = await PW_Query({
    title: 'foo/testing',
});
```

#### Display child pages using parent page ID:

```
const result = await PW_Query({
    post_parent: 6,
});
```

#### Display only top-level pages, exclude all child pages:

```
const result = await PW_Query({
    post_parent: 0,
});
```

#### Display posts whose parent is in an array:

```
const result = await PW_Query({
    post_parent__in: [2, 6]
});
```

#### Display only the specific posts:

```
const result = await PW_Query({
    post_type: 'page',
    post__in: [2, 5, 6],
});
```

#### Display all posts but NOT the specified ones:

```
const result = await PW_Query({
    post_type: 'page',
    post__not_in: [2, 5, 6],
});
```

**Note**: you cannot combine `post__in` and `post__not_in` in the same query.

### Post Type Parameters

Show posts associated with certain type.

- `post_type` (string / array) – use post types. Retrieves posts by post types, default value is ‘post‘. If ‘tax_query‘ is set for a query, the default value becomes ‘any‘;
  - `post` – a post.
  - `page` – a page.
  - `revision` – a revision.
  - `attachment` – an attachment. Whilst the default WP_Query post_status is ‘publish’, attachments have a default post_status of ‘inherit’. This means no attachments will be returned unless you also explicitly set post_status to ‘inherit’ or ‘any’. See Status parameters section below.
  - `nav_menu_item` – a navigation menu item
  - `any` – retrieves any type except revisions and types with ‘exclude_from_search’ set to true.
  - \*\* Custom Post Types (e.g. movies)

#### Display only pages:

```
const result = await PW_Query({
    post_type: 'page',
});
```

#### Display ‘any‘ post type (retrieves any type except revisions and types with ‘exclude_from_search’ set to TRUE):

```
const result = await PW_Query({
    post_type: 'any',
});
```

#### Display multiple post types, including custom post types:

```
const result = await PW_Query({
    post_type: ['post', 'page'],
});
```

### Status Parameters

Show posts associated with certain post status.

- `post_status` (string / array) – use post status. Retrieves posts by post status. Default value is ‘publish‘, but if the user is logged in, ‘private‘ is added. Public custom post statuses are also included by default. And if the query is run in an admin context (administration area or AJAX call), protected statuses are added too. By default protected statuses are ‘future‘, ‘draft‘ and ‘pending‘.
  - `publish` – a published post or page.
  - `pending` – post is pending review.
  - `draft` – a post in draft status.
  - `auto-draft` – a newly created post, with no content.
  - `future` – a post to publish in the future.
  - `private` – not visible to users who are not logged in.
  - `inherit` – a revision. see get_children() .
  - `trash` – post is in trashbin (available since version 2.9).
  - `any` – retrieves any status except for ‘inherit’, ‘trash’ and ‘auto-draft’. Custom post statuses with ‘exclude_from_search’ set to true are also excluded.

#### Display only posts with the ‘draft‘ status:

```
const result = await PW_Query({
    post_status: 'draft',
});
```

#### Display multiple post status:

```
const result = await PW_Query({
    post_status: ['pending', 'draft'],
});
```

#### Display all attachments:

```
const result = await PW_Query({
    post_status: 'any',
    post_type: 'attachment'
});
```

### Comment Parameters

`comment_count` parameter. It can be either an Integer or an Array.

- `comment_count` (int) – The amount of comments your CPT has to have ( Search operator will do a ‘=’ operation )
- `comment_count` (Array) – If comment_count is an array, it should have two arguments:
  - `value` – The amount of comments your post has to have when comparing
  - `compare` – The search operator. Possible values are ‘=’, ‘!=’, ‘>’, ‘>=’, ‘<‘, ‘<=’. Default value is ‘=’.

#### Display posts with 20 comments:

```
const result = await PW_Query({
    post_type: 'post',
    comment_count: 20
});
```

#### Display posts with 25 comments or more:

```
const result = await PW_Query({
    post_type => 'post',
    comment_count => [
        value => 25,
        compare => '>=',
    ]
});
```

### Pagination Parameters

- `nopaging` (boolean) – show all posts or use pagination. Default value is ‘false’, use paging.
- `posts_per_page` (int) – number of post to show per page. Use 'posts_per_page'=>-1 to show all posts (the 'offset' parameter is ignored with a -1 value). Set the ‘paged’ parameter if pagination is off after using this parameter. Note: if the query is in a feed, wordpress overwrites this parameter with the stored ‘posts_per_rss’ option. To reimpose the limit, try using the ‘post_limits’ filter, or filter ‘pre_option_posts_per_rss’ and return a very large number (if you want to return all posts) such as PHP constant PHP_INT_MAX so that on most cases all entries are outputted.
- `posts_per_archive_page` (int) – number of posts to show per page – on archive pages only. Over-rides posts_per_page and showposts on pages where is_archive() or is_search() would be true.
- `offset` (int) – number of post to displace or pass over. Warning: Setting the offset parameter overrides/ignores the paged parameter and breaks pagination. The 'offset' parameter is ignored when 'posts_per_page'=>-1 (show all posts) is used.
- `paged` (int) – number of page. Show the posts that would normally show up just on page X when using the “Older Entries” link.
- `page` (int) – number of page for a static front page. Show the posts that would normally show up just on page X of a Static Front Page.

#### Display x posts per page:

```
const result = await PW_Query({
    posts_per_page: 3,
});
```

#### Display all posts in one page:

```
const result = await PW_Query({
    posts_per_page: -1,
});
```

#### Display all posts by disabling pagination:

```
const result = await PW_Query({
     no_paging: true,
});
```

#### Display posts from the 4th one:

```
const result = await PW_Query({
    offset: 3,
});
```

#### Display 5 posts per page which follow the 3 most recent posts:

```
const result = await PW_Query({
    posts_per_page: 5,
    offset: 3
});
```

#### Display posts from page number x:

```
const result = await PW_Query({
    paged: 6,
});
```

### Order & Orderby Parameters

Sort retrieved posts.

- `order` (string | array) – Designates the ascending or descending order of the `orderby` parameter. Defaults to `DESC’. An array can be used for multiple order/orderby sets.
  - `ASC` – ascending order from lowest to highest values (1, 2, 3; a, b, c).
  - `DESC` – descending order from highest to lowest values (3, 2, 1; c, b, a).
- `orderby` (string | array) – Sort retrieved posts by parameter. Defaults to `date (post_date)’. One or more options can be passed.
  - `none` – No order (available since version 2.8).
  - `ID` – Order by post id. Note the capitalization.
  - `author` – Order by author.
  - `title` – Order by title.
  - `name` – Order by post name (post slug).
  - `type` – Order by post type (available since version 4.0).
  - `date` – Order by date.
  - `modified` – Order by last modified date.
  - `parent` – Order by post/page parent id.
  - `rand` – Random order.
  - `comment_count` – Order by number of comments (available since version 2.9).
  - `relevance` – Order by search terms in the following order: First, whether the entire sentence is matched. Second, if all the search terms are within the titles. Third, if any of the search terms appear in the titles. And, fourth, if the full sentence appears in the contents.
  - `menu_order` – Order by Page Order. Used most often for pages (Order field in the Edit Page Attributes box) and for attachments (the integer fields in the Insert / Upload Media Gallery dialog), but could be used for any post type with distinct `menu_order` values (they all default to 0).
  - `meta_value` – Note that a `meta_key=keyname` must also be present in the query. Note also that the sorting will be alphabetical which is fine for strings (i.e. words), but can be unexpected for numbers (e.g. 1, 3, 34, 4, 56, 6, etc, rather than 1, 3, 4, 6, 34, 56 as you might naturally expect). Use `meta_value_num` instead for numeric values. You may also specify `meta_type` if you want to cast the meta value as a specific type. Possible values are `NUMERIC’, `BINARY’, `CHAR’, `DATE’, `DATETIME’, `DECIMAL’, `SIGNED’, `TIME’, `UNSIGNED’, same as in `$meta_query`.
  - `meta_value_num` – Order by numeric meta value (available since version 2.8). Also note that a `meta_key=keyname` must also be present in the query. This value allows for numerical sorting as noted above in `meta_value`.
  - `post__in` – Preserve post ID order given in the post\_\_in array (available since version 3.5). Note – the value of the order parameter does not change the resulting sort order.
  - `post_name__in` – Preserve post slug order given in the `post_name\_\_in’ array (available since Version 4.6). Note – the value of the order parameter does not change the resulting sort order.
  - `post_parent__in` -Preserve post parent order given in the `post_parent\_\_in’ array (available since Version 4.6). Note – the value of the order parameter does not change the resulting sort order.

#### Display posts sorted by post ‘title’ in a descending order:

```
const result = await PW_Query({
    orderby: 'title',
    order: 'DESC'
});
```

#### Display posts sorted by ‘menu_order’ with a fallback to post ‘title’, in a descending order:

```
const result = await PW_Query({
    orderby: 'menu_order title',
    order: 'DESC'
});
```

#### Display one random post:

```
const result = await PW_Query({
    orderby: 'rand title',
    posts_per_page: 1
});
```

#### Display posts ordered by comment count (popularity):

```
const result = await PW_Query({
    orderby: 'comment_count',
});
```

#### Display posts with ‘Product’ type ordered by ‘Price’ custom field:

```
const result = await PW_Query({
    post_type: 'product',
    orderby: 'meta_value_num',
    meta_key: 'price'
});
```

#### Display pages ordered by ‘title’ and ‘menu_order’. (title is dominant):

```
const result = await PW_Query({
    post_type: 'page',
    orderby: 'title menu_order',
    order: 'ASC'
});
```

#### Display pages ordered by ‘title’ and ‘menu_order’ with different sort orders (ASC/DESC):

```
const result = await PW_Query({
    orderby: {
        title: 'DESC',
        menu_order: 'ASC',
    },
});
```

#### Mulitiple orderby/order pairs

```
const result = await PW_Query({
    orderby: {
        meta_value_num: 'DESC',
        title: 'ASC',
    },
    'meta_key' => 'age'
});
```

#### Display posts of type ‘my_custom_post_type’, ordered by ‘age’, and filtered to show only ages 3 and 4 (using meta_query).

```
const result = await PW_Query({
    post_type: 'my_custom_post_type',
    meta_key: 'age',
    orderby: 'meta_value_num',
    order: 'ASC',
    meta_query: [{
      key: 'age',
      value: [ 3, 4 ],
      compare: 'IN',
    }]
});
```

### Date Parameters

Show posts associated with a certain time and date period.

- `date_query` (array) – Date parameters (available since version 3.7).
  - `year` (int) – 4 digit year (e.g. 2011).
  - `month` (int) – Month number (from 1 to 12).
  - `week` (int) – Week of the year (from 0 to 53).
  - `day` (int) – Day of the month (from 1 to 31).
  - `hour` (int) – Hour (from 0 to 23).
  - `minute` (int) – Minute (from 0 to 59).
  - `second` (int) – Second (0 to 59).
    - `after` (string/array) – Date to retrieve posts after. Accepts strtotime()-compatible string, or array of ‘year’, ‘month’, ‘day’ values: - `year` (string) Accepts any four-digit year. Default is empty.
    - `month` (string) The month of the year. Accepts numbers 1-12. Default: 12.
    - `day` (string) The day of the month. Accepts numbers 1-31. Default: last day of month.
  - `before` (string/array) – Date to retrieve posts before. Accepts strtotime()-compatible string, or array of ‘year’, ‘month’, ‘day’ values:
    - `year` (string) Accepts any four-digit year. Default is empty.
    - `month` (string) The month of the year. Accepts numbers 1-12. Default: 1.
    - `day` (string) The day of the month. Accepts numbers 1-31. Default: 1.
  - `inclusive` (boolean) – For after/before, whether exact value should be matched or not’.
  - `compare` (string) – See WP_Date_Query::get_compare().
  - `column` (string) – Posts column to query against. Default: ‘post_date’.
  - `relation` (string) – OR or AND, how the sub-arrays should be compared. Default: AND.

#### Returns posts dated December 12, 2012:

```
const result = await PW_Query({
    date_query: [
        {
            year: 2012,
            month: 12,
            day: 12
        }
    ]
});
```

#### Returns posts for today:

```
const today = new Date();
const result = await PW_Query({
    date_query: [
        {
            year: today.getFullYear(),
            month: today.getMonth() + 1, // getMonth() returns 0–11
            day: today.getDate(),
        }
    ]
});
```

#### Returns posts for this week:

```
const today = new Date();
const result = await PW_Query({
    date_query: [
        {
            year: today.getFullYear(),
            month: today.getMonth() + 1, // getMonth() returns 0–11
        }
    ]
});
```

#### Return posts between 9AM to 5PM on weekdays

```
const result = await PW_Query({
    date_query: [
        {
            hour: 9,
            compare: '>='
        },
        {
            hour: 17,
            compare: '<='
        },
        {
            dayofweek: [2, 6],
            compare: 'between'
        }
    ],
    posts_per_page: -1,
});
```

#### Return posts from January 1st to February 28th

```
const result = await PW_Query({
    date_query: [
        {
            after: 'January 1st, 2013',
            before: {
                year: 2013,
                month: 2,
                day: 28,
            }
            inclusive: true,
        }
    ],
    posts_per_page: -1,
});
```

#### Return posts made over a year ago but modified in the past month

```
const result = await PW_Query({
    date_query: [
        {
            column: 'post_date_gmt',
            before: '1 year ago',
        },
        {
            column: 'post_modified_gmt',
            before: '1 month ago',
        }
    ],
    posts_per_page: -1,
});
```

### Custom Field (post meta) Parameters

Show posts associated with a certain custom field.

- `meta_key` (string) – Custom field key.
- `meta_value` (string) – Custom field value.
- `meta_compare` (string) – Operator to test the ‘meta_value‘. Possible values are ‘=’, ‘!=’, ‘>’, ‘>=’, ‘<‘, ‘<=’, ‘LIKE’, ‘NOT LIKE’, ‘IN’, ‘NOT IN’, ‘BETWEEN’, ‘NOT BETWEEN’, ‘NOT EXISTS’, ‘REGEXP’, ‘NOT REGEXP’ or ‘RLIKE’. Default value is ‘=’.
- `meta_query` (array) – Custom field parameters.
  - `relation` (string) – The logical relationship between each inner meta_query array when there is more than one. Possible values are ‘AND’, ‘OR’. Do not use with a single inner meta_query array.

meta_query also contains one or more arrays with the following keys:

- `key` (string) – Custom field key.
- `value` (string|array) – Custom field value. It can be an array only when compare is 'IN', 'NOT IN', 'BETWEEN', or 'NOT BETWEEN'. You don’t have to specify a value when using the 'EXISTS' or 'NOT EXISTS'
  (Note: Due to bug #23268, value is required for NOT EXISTS comparisons to work correctly prior to 3.9. You must supply some string for the value parameter. An empty string or NULL will NOT work. However, any other string will do the trick and will NOT show up in your SQL when using NOT EXISTS.)
- `compare` (string) – Operator to test. Possible values are ‘=’, ‘!=’, ‘>’, ‘>=’, ‘<‘, ‘<=’, ‘LIKE’, ‘NOT LIKE’, ‘IN’, ‘NOT IN’, ‘BETWEEN’, ‘NOT BETWEEN’, ‘EXISTS’ and ‘NOT EXISTS’. Default value is ‘=’.
- `type` (string) – Custom field type. Possible values are ‘NUMERIC’, ‘BINARY’, ‘CHAR’, ‘DATE’, ‘DATETIME’, ‘DECIMAL’, ‘SIGNED’, ‘TIME’, ‘UNSIGNED’. Default value is ‘CHAR’.
  The ‘type’ DATE works with the ‘compare’ value BETWEEN only if the date is stored at the format YYYY-MM-DD and tested with this format.

Important Note: meta_query takes an array of meta query arguments arrays (it takes an array of arrays) – you can see this in the examples below.
This construct allows you to query multiple metadatas by using the relation parameter in the first (outer) array to describe the boolean relationship between the meta queries. Accepted arguments are ‘AND’, ‘OR’. The default is ‘AND’.

#### Simple Custom Field Query:

Display posts where the custom field key is ‘color’, regardless of the custom field value:

```
const result = await PW_Query({
    meta_key: 'color',
});
```

Display posts where the custom field value is ‘blue’, regardless of the custom field key:

```
const result = await PW_Query({
    meta_value: 'blue',
});
```

Display page where the custom field value is ‘blue’, regardless of the custom field key:

```
const result = await PW_Query({
    meta_value: 'blue',
    post_type: 'page'
});
```

Display posts where the custom field key is ‘color’ and the custom field value is ‘blue’:

```
const result = await PW_Query({
    meta_key: 'color',
    meta_value: 'blue'
});
```

Display posts where the custom field key is ‘color’ and the custom field value IS NOT ‘blue’:

```
const result = await PW_Query({
    meta_key: 'color',
    meta_value: 'blue',
    meta_compare: '!='
});
```

Display posts where the custom field key is a set date and the custom field value is now. Displays only posts which date has not passed.

```
const dateValue = new Date(2015, 6, 1).toISOString();
const result = await PW_Query({
    post_type: 'event',
    meta_key: 'event_date',
    meta_value: dateValue,
    meta_compare: '>'
});
```

Display ‘product'(s) where the custom field key is ‘price’ and the custom field value that is LESS THAN OR EQUAL TO 22.
By using the ‘meta_value’ parameter the value 99 will be considered greater than 100 as the data are stored as strings, not numbers. For number comparison use the ‘meta_type’ argument.

```
const result = await PW_Query({
    meta_key: 'price',
    meta_value: '22',
    meta_compare: '<=',
    post_type: 'product'
});
```

#### Display posts from a single custom field:

```
const result = await PW_Query({
    post_type: 'product',
    meta_query: [
        {
            key: 'color',
            value: 'blue',
            compare: 'NOT LIKE'
        }
    ]
});
```

#### Display posts from several custom fields:

```
const result = await PW_Query({
    post_type: 'product',
    meta_query: [
        {
            key: 'color',
            value: 'blue',
            compare: 'NOT LIKE'
        },
        {
            key: 'price',
            value: [20, 100],
            type: 'numeric',
            compare: 'BETWEEN'
        }
    ]
});
```

#### Display posts that have meta key ‘color’ NOT LIKE value ‘blue’ OR meta key ‘price’ with values BETWEEN 20 and 100:

```
const result = await PW_Query({
    post_type: 'product',
    meta_query: [
        {
            relation: 'OR',
            [
                {
                    key: 'color',
                    value: 'blue',
                    compare: 'NOT LIKE'
                },
                {
                    key: 'price',
                    value: [20, 100],
                    type: 'numeric',
                    compare: 'BETWEEN'
                }
            ]
        },
    ]
});
```

The 'meta_query' clauses can be nested in order to construct complex queries. For example, show productss where color=orange OR color=red&size=small translates to the following:

```
const result = await PW_Query({
    post_type: 'product',
    meta_query: [
        {
            relation: 'OR',
            [
                {
                    key: 'color',
                    value: 'orange',
                    compare: '='
                },
                {
                    relation: 'AND',
                    [
                        {
                            key: 'color',
                            value: 'red',
                            compare: '='
                        },
                        {
                            key: 'size',
                            value: 'small',
                            compare: '='
                        },
                    ]
                }

            ]
        },
    ]
});
```

### Permission Parameters

Show posts if user has the appropriate capability

- `perm` (string) – User permission.

#### Display published and private posts, if the user has the appropriate capability:

```
const result = await PW_Query({
    post_status: ['publish', 'private'],
    perm: 'readable'
});
```

### Mime Type Parameters

Used with the attachments post type.

- `post_mime_type` (string/array) – Allowed mime types.

#### Get attachments that are gif images:

Get gif images and remember that by default the attachment’s post_status is set to inherit.

```
const result = await PW_Query({
    post_type: 'attachment',
    post_status: 'inherit',
    post_mime_type: 'image/gif',
});
```

#### Full Example

```
import { PW_Query } from '@/Includes/Posts.js';

const Posts = () => {
    const [posts, setPosts] = useState([]);

    useEffect(()=>{
        const pwQuery = async () => {
            const result = await PW_Query({
                post_type: 'post',
                posts_per_page: 5,
                orderby: 'date',
                order: 'DESC',
                author: 1,
            });

            if(result.data.length > 0) setPosts(result.data);
        };
        pwQuery();
    }, )

    return (
        <>
            {posts.map((post)=><h1>{post.post_title}</h1>)}
        </>
    )
}
```
