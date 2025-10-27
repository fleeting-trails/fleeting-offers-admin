import AdvertiseCategoryIcon from '$lib/icons/AdvertiseCategoryIcon.svelte'
import AdvertiseIndustryIcon from '$lib/icons/AdvertiseIndustryIcon.svelte'
import AdvertiseDealIcon from '$lib/icons/AdvertiseDealIcon.svelte'
import AdvertiseOwnerIcon from '$lib/icons/AdvertiseOwnerIcon.svelte'
import AdvertiseTagIcon from '$lib/icons/AdvertiseTagIcon.svelte'
import CampaigAdsIcon from '$lib/icons/CampaignAdsIcon.svelte'
import DashboardIcon from '$lib/icons/DashboardIcon.svelte'
import AdvertiseAdIcon from '$lib/icons/AdvertiseAdIcon.svelte'

const navTree: Core.NavTree = [
  {
    id: 'analytics',
    label: 'Analytics',
    description: 'View system-level usage stats and reports.',
    tags: ['analytics', 'insights'],
    module: [
      {
        id: 'analytics.dashboard',
        label: 'Dashboard',
        icon: DashboardIcon,
        description: 'View analytics dashboard',
        tags: ['metrics'],
        submodule: [
          {
            id: 'analytics.dashboard.view',
            label: 'View Analytics',
            description: 'System-wide analytics view',
            tags: ['view'],
          },
        ],
      },
    ],
  },
  {
    id: 'advertise',
    label: 'Advertise',
    description: 'Manage advertisements and related content.',
    tags: ['advertise', 'ads', 'promotion'],
    module: [
      {
        id: 'advertise.advertisements',
        label: 'Advertisements',
        icon: AdvertiseAdIcon,
        description: 'Manage advertisements',
        tags: ['advertisements', 'ads'],
        submodule: [
          {
            id: 'advertise.advertisements.all',
            label: 'List',
            description: 'View all advertisements',
            tags: ['view', 'all', 'list'],
          },
          {
            id: 'advertise.advertisements.create',
            label: 'Create Advertisement',
            description: 'Add a new advertisement',
            tags: ['create'],
          },
        ],
      },
      {
        id: 'advertise.categories',
        label: 'Categories',
        icon: AdvertiseCategoryIcon,
        description: 'Manage advertise categories',
        tags: ['category', 'advertise-categories'],
        submodule: [
          {
            id: 'advertise.categories.list',
            label: 'Category List',
            description: 'Category List',
            tags: ['list'],
          },
          {
            id: 'advertise.categories.create',
            label: 'Create Category',
            description: 'Add a new category',
            tags: ['create'],
          },
        ],
      },
      {
        id: 'advertise.industries',
        label: 'Industries',
        icon: AdvertiseIndustryIcon,
        description: 'Classify advertisements by industry',
        tags: ['industry'],
        submodule: [
          {
            id: 'advertise.industries.list',
            label: 'List Industries',
            description: 'View all industry classifications',
            tags: ['list'],
          },
          {
            id: 'advertise.industries.create',
            label: 'Create Industry',
            description: 'Add a new industry classification',
            tags: ['create'],
          },
        ],
      },
      {
        id: 'advertise.tags',
        label: 'Tags',
        icon: AdvertiseTagIcon,
        description: 'Manage ad tags and keywords',
        tags: ['tags', 'keywords'],
        submodule: [
          {
            id: 'advertise.tags.create',
            label: 'Create Tag',
            description: 'Add a new tag',
            tags: ['create'],
          },
          {
            id: 'advertise.tags.update',
            label: 'Update Tag',
            description: 'Edit existing tags',
            tags: ['update'],
          },
        ],
      },
      {
        id: 'advertise.deals',
        label: 'Deals',
        icon: AdvertiseDealIcon,
        description: 'Configure types of deals and discounts',
        tags: ['deals', 'types'],
        submodule: [
          {
            id: 'advertise.deals.create',
            label: 'Create Deal Type',
            description: 'Add a new deal type',
            tags: ['create'],
          },
          {
            id: 'advertise.deals.update',
            label: 'Update Deal Type',
            description: 'Edit existing deal types',
            tags: ['update'],
          },
        ],
      },
      {
        id: 'advertise.owners',
        label: 'Owners',
        icon: AdvertiseOwnerIcon,
        description: 'Assign ownership and contributors to ads',
        tags: ['owners', 'contributors'],
        submodule: [
          {
            id: 'advertise.owners.create',
            label: 'Add Owner',
            description: 'Assign a new owner',
            tags: ['create'],
          },
          {
            id: 'advertise.owners.update',
            label: 'Update Owner Role',
            description: 'Change ownership level',
            tags: ['update'],
          },
        ],
      },
    ],
  },
  {
    id: 'campaign',
    label: 'Campaigns',
    description: 'Group multiple advertisements into promotional campaigns.',
    tags: ['campaign', 'ads', 'bundle'],
    module: [
      {
        id: 'campaign.campaignAds',
        label: 'Campaign Ads',
        icon: CampaigAdsIcon,
        description: 'Manage ads under a campaign',
        tags: ['campaign', 'mapping'],
        submodule: [
          {
            id: 'campaign.campaignAds.create',
            label: 'Add to Campaign',
            description: 'Assign ads to campaigns',
            tags: ['create'],
          },
          {
            id: 'campaign.campaignAds.update',
            label: 'Update Campaign Mapping',
            description: 'Modify existing campaign ads',
            tags: ['update'],
          },
        ],
      },
    ],
  },
]

export default navTree
