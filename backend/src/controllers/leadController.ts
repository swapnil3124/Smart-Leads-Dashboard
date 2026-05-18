import { Request, Response } from 'express';
import Lead, { ILead, LeadStatus, LeadSource } from '../models/Lead';
import { asyncHandler } from '../middleware/errorMiddleware';
import { z } from 'zod';

const leadSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']).optional(),
  source: z.string().optional(),
});

export const getLeads = asyncHandler(async (req: Request, res: Response) => {
  const { status, source, search, sort, page = 1, limit = 10 } = req.query;

  const query: any = {};

  // Filtering
  if (status) {
    query.status = status as LeadStatus;
  }
  if (source) {
    query.source = source as LeadSource;
  }

  // Search
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  // Sorting
  let sortOption: any = { createdAt: -1 }; // Default: Latest
  if (sort === 'oldest') {
    sortOption = { createdAt: 1 };
  } else if (sort === 'latest') {
    sortOption = { createdAt: -1 };
  }

  // Pagination
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const skip = (pageNum - 1) * limitNum;

  const total = await Lead.countDocuments(query);
  const leads = await Lead.find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(limitNum);

  res.json({
    data: leads,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum),
    },
  });
});

export const createLead = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = leadSchema.parse(req.body);
  const { name, email, status, source } = validatedData;

  const lead = await Lead.create({
    name,
    email,
    status: status as LeadStatus,
    source: source as LeadSource,
  });

  res.status(201).json(lead);
});

export const getLeadById = asyncHandler(async (req: Request, res: Response) => {
  const lead = await Lead.findById(req.params.id);

  if (lead) {
    res.json(lead);
  } else {
    res.status(404);
    throw new Error('Lead not found');
  }
});

export const updateLead = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = leadSchema.partial().parse(req.body);
  const { name, email, status, source } = validatedData;

  const lead = await Lead.findById(req.params.id);

  if (lead) {
    if ((req as any).user.role === 'Sales User') {
      // Sales User can ONLY update status
      lead.status = (status as LeadStatus) || lead.status;
    } else {
      // Admin can update everything
      lead.name = name || lead.name;
      lead.email = email || lead.email;
      lead.status = (status as LeadStatus) || lead.status;
      lead.source = (source as LeadSource) || lead.source;
    }

    const updatedLead = await lead.save();
    res.json(updatedLead);
  } else {
    res.status(404);
    throw new Error('Lead not found');
  }
});

export const deleteLead = asyncHandler(async (req: Request, res: Response) => {
  const lead = await Lead.findById(req.params.id);

  if (lead) {
    await lead.deleteOne();
    res.json({ message: 'Lead removed' });
  } else {
    res.status(404);
    throw new Error('Lead not found');
  }
});

export const exportLeads = asyncHandler(async (req: Request, res: Response) => {
  const { status, source, search } = req.query;

  const query: any = {};

  if (status) query.status = status;
  if (source) query.source = source;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const leads = await Lead.find(query).sort({ createdAt: -1 });

  // Generate CSV
  const headers = ['Name', 'Email', 'Status', 'Source', 'Created At'];
  const rows = leads.map((lead) => [
    lead.name,
    lead.email,
    lead.status,
    lead.source,
    lead.createdAt.toISOString().replace('T', ' ').substring(0, 16),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell.toString().replace(/"/g, '""')}"`).join(',')),
  ].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
  res.status(200).send(csvContent);
});

export const getLeadStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await Lead.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const result: any = {
    total: 0,
    New: 0,
    Contacted: 0,
    Qualified: 0,
    Lost: 0,
  };

  stats.forEach((stat) => {
    result[stat._id] = stat.count;
    result.total += stat.count;
  });

  res.json(result);
});

export const getLeadGrowth = asyncHandler(async (req: Request, res: Response) => {
  const growth = await Lead.aggregate([
    {
      $group: {
        _id: {
          month: { $month: '$createdAt' },
          year: { $year: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const formattedData = growth.map((item) => ({
    name: months[item._id.month - 1],
    leads: item.count,
  }));

  res.json(formattedData);
});
