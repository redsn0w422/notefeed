package function;

import function.domains.*;

/**
 * Write a description of class AbsFunction here.
 * 
 * @author (your name) 
 * @version (a version number or a date)
 */
public class AbsFunction extends Rectangular
{
    private Rectangular f;

    /**
     * Construct an absolute value function with the given function representing the
     * expression inside the absolute value.
     * 
     * @param inner the function to be used
     */
    public AbsFunction(Rectangular inner)
    {
        super();
        f = inner;
    }
    
    /**
     * Return the function inside the absolute value expressions.
     * 
     * @return the inner function
     */
    public Rectangular getInner()
    {
        return f;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public double evaluate(double x)
    {
        return Math.abs(f.evaluate(x));
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    public double findZero(double left, double right)
    {
        return f.findZero(left, right);
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    public FiniteDoubleSet findAllZeros(double left, double right)
    {
        return f.findAllZeros(left, right);
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    public Rectangular differentiate()
    {
        return null; // needs to be implemented
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    public Rectangular integrate()
    {
        return null; // needs to be implemented
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    public FiniteDomain getDomain(double left, double right)
    {
        return f.getDomain(left, right);
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    public String toString()
    {
        return "|" + f + "|";
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    public boolean equals(Object o)
    {
        if (o instanceof AbsFunction)
        {
            return ((AbsFunction) o).getInner().equals(f);
        }
        return false;
    }
}
