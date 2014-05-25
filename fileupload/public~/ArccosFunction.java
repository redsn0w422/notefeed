package function;

import function.domains.*;

/**
 * An arccos function.
 * 
 * @author Nathan Lindquist 
 * @version 15 March 2013
 */
public class ArccosFunction extends ArctrigFunction
{
    /**
     * Instantiate an arccos function with the default inner function x.
     */
    public ArccosFunction()
    {
        super();
    }
    
    /**
     * Instantiate an arccos function with the given inner function.
     * @param inner the inner function
     */
    public ArccosFunction(Rectangular inner)
    {
        super(inner);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public double _evaluate(double x)
    {
        return Math.acos(x);
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    public double findZero(double left, double right)
    {
        return valueInRange(left, right, 1);
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    public Rectangular _differentiate()
    {
        return new ProductFunction(new Constant(-1), new ArcsinFunction(getInner()).differentiate());
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    public FiniteDomain getDomain(double left, double right)
    {
        return new FiniteDomain(left, right, new Subset(left, right), new Subset(-1, true, 1, true));
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    public String _toString()
    {
        return "arccos(x)";
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    public boolean _equals(Object o)
    {
        return o instanceof ArccosFunction;
    }
}
